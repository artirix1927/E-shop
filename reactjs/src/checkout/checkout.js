import { Field, Form, Formik, useField } from "formik"

import '../css/checkout.scss'
import { Link, useLocation,  } from "react-router-dom"
import { useEffect, useState } from "react"
import { useCookies } from "react-cookie"
import { useMutation, useQuery } from "@apollo/client"
import { CREATE_ORDER } from "../gql/mutations"

import * as Yup from 'yup';
import { GET_AVAILABLE_COUNTRIES, GET_CITIES_BY_COUNTRY_STATE, GET_STATES_BY_COUNTRY } from "../gql/queries"



import Select from 'react-select'


const OrderValidationScheme = Yup.object().shape({
    fullName: Yup.string().min('2').max('50').required('Required'),
    phoneNumber :Yup.string().required("Required"),
    country: Yup.string().required('Required'),
    city: Yup.string().required('Required'),
    adress: Yup.string().required('Required'),
    postalCode: Yup.string().required('Required'),

})

export const Checkout = () => {
    const params = useLocation()

    const selectedItems = params.state.selectedItems

    const backToCartModalId = 'back-to-cart'

    return <div className="container">

        <div>
            <SummaryCard selectedItems={selectedItems} backToCartModalId={backToCartModalId}></SummaryCard>
        </div>

        <div>
            <BackToCartModal backToCartModalId={backToCartModalId}></BackToCartModal>
        </div>

        <div>
            <OrderForm selectedItems={selectedItems}></OrderForm>
        </div>


    </div>
}


const SummaryCard = (props) => {
    const [sum,setSum] = useState(0)
    const [itemsCounter, setItemsCounter] = useState(0)

    useEffect(()=>{
        //setting sum value and items counter
        let sum=0;
        let itemCounter=0;
        props.selectedItems.map((item)=>{
            itemCounter+=item.quantity;
            return sum+=(item.product.price*item.quantity);
        })
        setItemsCounter(itemCounter)
        setSum(sum)
    }, [props.selectedItems])

    const modalIdForToggle = `#${props.backToCartModalId}`

    return <>
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">Order summary:</h5>
                <h6 className="card-title" data-bs-toggle="modal" data-bs-target={modalIdForToggle}>Items: {itemsCounter}</h6>
                <h6 className="card-title">Total: {sum}</h6>
            </div>
        </div>
    </>

}


const BackToCartModal = (props) => {
    return <>
    <div className="modal" tabIndex="-1" id={props.backToCartModalId}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Want to come back to the cart?</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-footer">
                        <Link to='/cart'>
                            <button  type="button" className="btn btn-primary" data-bs-dismiss="modal">Yes</button>
                        </Link>
                        
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">No</button>
                    </div>
                </div>
            </div>
        </div>
    </>
}


const OrderForm = (props) => {
    
    const [cookies] = useCookies()
    const [createOrder] = useMutation(CREATE_ORDER)

    const formOnSubmit = (values) =>{ 
        const userId = cookies.user.id
        const itemsId=[]
        props.selectedItems.map((item)=>itemsId.push(item.id))

        const requestData = Object.assign({user: parseInt(userId), items: JSON.stringify(itemsId)}, values)
        createOrder({variables: requestData})
    }

    const formInitialValues = {fullName:'', phoneNumber:'', country:'', state: '', city:'', adress:'', postalCode:''}

    return <>
        <Formik initialValues={formInitialValues}
        onSubmit={formOnSubmit} validationSchema={OrderValidationScheme}>

            <Form className="checkout-form">
                <Field name="fullName" className="form-control" placeholder="Full Name"></Field>
                <Field name="phoneNumber" className="form-control" placeholder="Phone Number"></Field>


                <Field name="country" className="select-form-control" component={SelectCountriesField} placeholder="Country" />

                <Field name="state" className="select-form-control" component={SelectStatesField} placeholder="State/Province" />

                <Field name="city" className="select-form-control" component={SelectCitiesField} placeholder="City/Village" />

                <Field name="adress" className="form-control" placeholder="Adress, Street, Building, Unit"></Field>
                <Field name="postalCode"className="form-control"  placeholder="Postal Code"></Field>

                <button type="submit" className="btn btn-success">Order</button>

                
            </Form>
        </Formik>
    </>
}


const SelectCountriesField = (props) => {
    const {data} = useQuery(GET_AVAILABLE_COUNTRIES)

    const [countryOptions, setCountryOptions] = useState([])
    
    useEffect(() => {
        let options = []
        if (data){
            data.availableCountries.map((country)=>{
            
                return options = [...options, {label: country.name, value: country.name}]
            })
        }
        setCountryOptions(options)
    },[data])

    return <><SelectField {...props} options={countryOptions}/></>
}


const SelectStatesField = (props) => {
    

    const {data} = useQuery(GET_STATES_BY_COUNTRY, {variables:{ country: props.form.values.country.value }})
    const [statesOptions, setStatesOptions] = useState([])

    useEffect(() => {
        let options = []
        if (data){
            data.statesByCountry.map((state)=>{
                console.log(state.name)
                return options = [...options, {label: state, value: state}]
            })
        }
        setStatesOptions(options)
    },[data])

    return <><SelectField {...props} options={statesOptions}/></>
}


const SelectCitiesField = (props) => {
    const {data} = useQuery(GET_CITIES_BY_COUNTRY_STATE, {variables:{ country: props.form.values.country.value, 
                                                                      state: props.form.values.state.value  }})
    const [citiesOptions, setStatesOptions] = useState([])

    useEffect(() => {
        let options = []
        if (data){
            data.citiesByCountryState.map((city)=>{
                return options = [...options, {label: city, value: city}]
            })
        }
        setStatesOptions(options)
    },[data])

    return <><SelectField {...props} options={citiesOptions}/></>



}


const SelectField = ({options, ...props }) => {
    const [field, , helpers] = useField(props.field);

    const handleChange = (selectedOption) => {
      helpers.setValue(selectedOption);
    };

    return (
      <div>
        <Select
          {...field}
          {...props}
          value={field.value}
          onChange={handleChange}
          options={options}
        />
      </div>
    );
  };
  