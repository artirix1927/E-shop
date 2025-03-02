import { useMutation, useQuery } from "@apollo/client"
import { useNavigate, useParams } from "react-router-dom"
import { GET_MODEL_INSTANCE_FORM } from ".././gql/queries"
import { Form, Formik } from "formik"

import { GetField } from "./formikFields"
import { UPDATE_MODEL_INSTANCE } from ".././gql/mutations"
import { ModelsPanel } from "./modelsPanel"


export const UpdateModelInstance = () => {

    const {appName,modelName,id} = useParams()
   
    const {data,loading, error} = useQuery(GET_MODEL_INSTANCE_FORM, {variables: {appName: appName, modelName: modelName, id:parseInt(id)}})

    if (loading) return <></>
    if (error) return <p>{error.message}</p>
    
    const form = JSON.parse(data.modelInstanceForm.form) 

    return <>
    <div>
            <div>
                <ModelsPanel></ModelsPanel>
            </div>
            
            <div className="update-instance-div">
                <InstanceForm form={form}/>
            </div>
        
    </div>

    


    </>
    


}


const InstanceForm = (props) => {
    const form = props.form

    const navigate = useNavigate()

    const initialValues = {}

    form.fields.map((field) => {
        return initialValues[field.name] = field.initial
        }   
    )

    const {appName, modelName, id} = useParams()
    
    const [updateInstance] = useMutation(UPDATE_MODEL_INSTANCE)

    const handleSubmit = (values) => {

        let formFileValues = [];

        Object.keys(values).forEach((key) => {
            if (values[key] instanceof File) {
                formFileValues.push({name: key, file: values[key]});
                delete values[key]
                
            }
          });


        const mutationVariables = {
            appName: appName,
            modelName: modelName,
            instanceId: parseInt(id),
            formValues: JSON.stringify(values),
            files: formFileValues,
        };
    
        updateInstance({ variables: mutationVariables, refetchQueries:['ModelInstanceForm', 'ModelInstances']} );
        navigate(-1)
    };


    return <>
        <Formik 
        initialValues={initialValues}
        onSubmit={handleSubmit}
     >
        <Form  className="update-instance-form" encType="multipart/form-data">
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

