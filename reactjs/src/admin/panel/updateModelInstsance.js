import { useQuery } from "@apollo/client"
import { useLocation } from "react-router-dom"
import { GET_MODEL_INSTANCE_FORM } from "../../gql/queries"
import { Form, Formik } from "formik"

import { AdminPanel } from "./panel"

import { CheckboxField, ChoiceField, DateTimeField, DefaultField, FileField, TextAreaField } from "./formikFields"


export const UpdateModelInstance = () => {

    const {state} = useLocation()
   
    const {data,loading, error} = useQuery(GET_MODEL_INSTANCE_FORM, {variables: {appName: state.appName, modelName: state.modelName, id:parseInt(state.id)}})

    if (loading) return <></>
    if (error) return <p>{error.message}</p>
    
    const form = JSON.parse(data.modelInstanceForm.form) 

    return <>
    <div>
            <div>
                <AdminPanel></AdminPanel>
            </div>

            <div style={{display:'flex', justifyContent:'center'}}>
                <InstanceForm form={form}/>
            </div>
        
    </div>

    


    </>
    


}


const InstanceForm = (props) => {
    const form = props.form

    const initialValues = {}

    form.fields.map((field) => {
        return initialValues[field.name] = field.initial
        }   
    )

    // form.choice_fields.map((field) => {
    //     initialValues[field.name] = field.initial
    // })


    return <>
        <Formik 
        initialValues={initialValues}
     >
       
        <Form  className="update-instance-form" encType="multipart/form-data">
            {form.fields.map((field) => {
                return <GetField key={field.name} field={field}/>
            })
            }
        
        </Form>
    
       
     </Formik>
    </>
}




const GetField = (props) =>{
    const field = props.field

    const FIELDS_BY_TYPE = {datetime: DateTimeField, 
                            checkbox: CheckboxField, 
                            file:FileField, 
                            select:ChoiceField, 
                            textarea: TextAreaField
                            }

    if (FIELDS_BY_TYPE.hasOwnProperty(field.type)){
        const Component = FIELDS_BY_TYPE[field.type]
        return <Component field={field}/>
    }
    return <DefaultField field={field}/>
        
}