import { Formik, Form} from "formik"
import { GET_MODEL_CREATE_FORM } from "../../gql/queries"
import { useLocation, useNavigate } from "react-router-dom"

import { useMutation, useQuery } from "@apollo/client"

import { CREATE_MODEL_INSTANCE } from "../../gql/mutations"
import { GetField } from "./formikFields"
import { AdminLayout } from "../Layout"

export const CreateModelInstance = () => {

    const {state} = useLocation()

    const {data,loading, error} = useQuery(GET_MODEL_CREATE_FORM, {variables: {appName: state.appName, modelName: state.modelName}})

    if (loading) return <></>
    if (error) return <p>{error.message}</p>

    const form = JSON.parse(data.modelCreateForm.form) 

    return <>
    <AdminLayout>
            <div className="col-xl-9 col-lg-8 col-md-8 update-instance-div">
                <ModelForm form={form}/>
            </div>
    </AdminLayout>
    


    </>
    


}


const ModelForm = (props) => {
    const form = props.form

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
        

        //the refetch query doesnt works there dont know why, 
        //maybe becaus the model instances component is not mounted at that point
        //even though the query must be in cache at that point
        createInstance({ variables: mutationVariables, refetchQueries: ['ModelInstances',]});
        navigate(-1)
    };
    
    const initialValues = {}
    form.fields.map((field) => {
        return initialValues[field.name] = field.initial
        }   
    )

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
            <button type="submit" className="btn btn-success submit-button">Save</button>
        </Form>
    
        
       
     </Formik>
    </>
}


