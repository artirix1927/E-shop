import { Formik, Form} from "formik"
import { GET_MODEL_CREATE_FORM, GET_MODEL_INSTANCES } from "../../gql/queries"
import { useLocation, useNavigate } from "react-router-dom"

import { CheckboxField, ChoiceField, DateTimeField, DefaultField, FileField, TextAreaField } from "./formikFields"
import { useMutation, useQuery } from "@apollo/client"
import { AdminPanel } from "./panel"
import { CREATE_MODEL_INSTANCE } from "../../gql/mutations"

export const CreateModelInstance = () => {

    const {state} = useLocation()
    console.log(state)
    const {data,loading, error} = useQuery(GET_MODEL_CREATE_FORM, {variables: {appName: state.appName, modelName: state.modelName}})

    if (loading) return <></>
    if (error) return <p>{error.message}</p>

    const form = JSON.parse(data.modelCreateForm.form) 

    return <>
    <div>
    
        <div>
            <AdminPanel></AdminPanel>
        </div>
        
        <div className="update-instance-div">
            <ModelForm form={form}/>
        </div>
        
    </div>

    


    </>
    


}


const ModelForm = (props) => {
    const form = props.form

    const initialValues = {}

    form.fields.map((field) => {
        return initialValues[field.name] = field.initial
        }   
    )

    const navigate = useNavigate()
    const {state} = useLocation()
    
    const [createInstance] = useMutation(CREATE_MODEL_INSTANCE)

    const handleSubmit = (values) => {

        let formFileValues = [];

        Object.keys(values).forEach((key) => {
            if (values[key] instanceof File) {
                formFileValues.push({name: key, file: values[key]});
                delete values[key]
                
            }
          });


        const mutationVariables = {
            appName: state.appName,
            modelName: state.modelName,
            formValues: JSON.stringify(values),
            files: formFileValues,
        };
    
        createInstance({ variables: mutationVariables, refetchQueries: [GET_MODEL_INSTANCES, "ModelInstances"]});
        navigate('/admin/model-instances', {state:{appName:state.appName, modelName: state.modelName}})
    };


    return <>
        <Formik 
        initialValues={initialValues}
        onSubmit={handleSubmit}
     >
       
        <Form className="update-instance-form" encType="multipart/form-data">
            {form.fields.map((field) => {
                
                return <GetField key={field.name} field={field}/>
                
            })
            }
        
            <br/>
            <button type="submit" className="btn btn-success">Save</button>
        </Form>
    
        
       
     </Formik>
    </>
}




const GetField = (props) =>{
    const field = props.field

    const FIELDS_BY_TYPE = {datetime: DateTimeField, 
                            checkbox: CheckboxField, 
                            file: FileField, 
                            select: ChoiceField, 
                            textarea: TextAreaField
                            }

    if (FIELDS_BY_TYPE.hasOwnProperty(field.type)){
        const Component = FIELDS_BY_TYPE[field.type]
        return <Component field={field}/>
    }
    return <DefaultField field={field}/>
        
}