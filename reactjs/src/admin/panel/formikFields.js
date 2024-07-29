import { Field, useFormikContext } from "formik"

import "react-datetime/css/react-datetime.css";
import Datetime from 'react-datetime'

const FieldLabel = ({field, ...props}) => {
    return <>
    <label>
        {field.label}
        {field.required && <span style={{color:"red"}}> * </span>}
    </label>

    
</>

}


const BaseField =  ({field, ...props}) => {



    return <>
    
    <FieldLabel field={field}/>

    <div>
        {props.children}
    </div>
    
    </>
}


export const DateTimeField = ({field, ...props}) => {
    

    return <>
        <BaseField field={field}>

            <Field name={field.name} type={field.type} required={field.required} as={Datetime}/>

        </BaseField>
    </>

}



export const CheckboxField = ({field, ...props}) => {


    return <>
        <BaseField field={field}>

            <span><FieldLabel field={field}></FieldLabel> 
            <Field name={field.name} type={field.type} required={field.required} className="form-check-input"/></span>
            <br/>
        
        </BaseField>
        
    
    </>
}



export const FileField = ({field,...props}) => {
    const formik = useFormikContext()

    const get_file_name_from_initial_path = () => {
        const initial_path_split = field.initial.split('/')
        return initial_path_split[initial_path_split.length-1]
    }

    return <>
        <BaseField field={field}>
            <p href={`http://localhost:8000/media/${field.initial}`}>
                Current Image : <a href={`http://localhost:8000/media/${field.initial}`}>
                {get_file_name_from_initial_path()}</a>
            </p>

            <img src={`http://localhost:8000/media/${field.initial}`} alt="" style={{width:200, height:200, objectFit:"contain"}}/>

            <br/>
            <br/>

            <div>
                <input name={field.name} type={field.type} required={field.required}
                onChange={event => formik.setFieldValue(field.name, event.target.files[0])}/>
            </div>

        
        </BaseField>
        
    </>
}



export const ChoiceField = ({field,...props}) => {

    if (!field.choices.length)
        return <></>

    return <>
        <BaseField field={field}>
            <Field name={field.name} as={field.type} 
                    required={field.required} className="form-control form-select" 
                    multiple={field.multiple}>
                        
                    {field.choices.map((choice, idx) => {
                    
                    return <option key={idx} value={choice[0]}>
                    {choice[1]}
                    </option>
                    })}
            </Field>
        </BaseField>
    </>
}



export const TextAreaField = ({field, ...props}) => {

    return <>
    <BaseField field={field}>
        <textarea name={field.name} type={field.type} 
                required={field.required}
                className="form-control"
                defaultValue={field.initial}
                />
    </BaseField>

    </>
}


export const DefaultField = ({field, ...props}) => {
    return <>
        <BaseField field={field}>
        
            <Field name={field.name} type={field.type} 
                required={field.required}className="form-control"/>

        </BaseField>
    </>
}


