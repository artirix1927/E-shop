import { Field, Form, Formik} from "formik"


import { useCookies } from "react-cookie"
import { useMutation } from "@apollo/client"
import { CREATE_ORDER } from "./gql/mutations"

import * as Yup from 'yup';

import { useNavigate } from "react-router-dom";
import { SelectCitiesField, SelectCountriesField, SelectStatesField } from "./customFormFields";


const OrderValidationScheme = Yup.object().shape({
    fullName: Yup.string().min('2').max('50').required('Required'),
    phoneNumber :Yup.string().required("Required"),
    adress: Yup.string().required('Required'),
    postalCode: Yup.string().required('Required'),

})



export const OrderForm = (props) => {
    
    const [cookies] = useCookies()
    const [createOrder] = useMutation(CREATE_ORDER)
    const nav = useNavigate()

    const formOnSubmit = (values) =>{ 
        const userId = cookies.user.id
        const itemsId=[]
        
        props.selectedItems.map((item)=>itemsId.push(item.id))
       
        const requestData = Object.assign({user: parseInt(userId), items: JSON.stringify(itemsId)}, values)
       
        createOrder({variables: requestData})

        nav('/cart')
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


