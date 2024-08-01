import { Field, useFormikContext } from "formik"


import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Import default styles

const FieldLabel = ({field, ...props}) => {
    return <>
    <label>
        {field.label}
        {field.required && <span style={{color:"red"}}> * </span>}
    </label>

    
</>

}


const DateTimePicker = ({ field, form, ...props }) => {
    const { name, value} = field;
    const { setFieldValue } = form;

    const dateFormat = "MMM, d, Y HH:mm"
    
    return (
        <DatePicker
            {...props}
            selected={value ? new Date(value) : null}
            onChange={date => setFieldValue(name, date)}
            className="form-control" // Add your custom class
            timeFormat="HH:mm"
            timeIntervals={15}
            timeCaption="time"
            dateFormat={dateFormat}
        />
    );
};


const BaseField =  ({field, ...props}) => {

    return <>
    
    <FieldLabel field={field}/>

    <div>
        {props.children}
    </div>
    
    </>
}



const DateTimeField = ({ field, form, ...props }) => {

    
    return (
        <BaseField field={field}>

        <Field name={field.name} component={DateTimePicker}/>

        </BaseField>
    );
};


const FileField = ({field,...props}) => {
    const formik = useFormikContext()

    const get_file_name_from_initial_path = () => {
        const initial_path_split = field.initial.split('/')
        return initial_path_split[initial_path_split.length-1]
    }


    let required = field.required;

    if (required && field.initial)
        required = false;

    

    return <>
        <BaseField field={field}>

            {field.initial && <>
            
                <p href={`http://localhost:8000/media/${field.initial}`}>
                    Current Image <a href={`http://localhost:8000/media/${field.initial}`} target="blank">
                    {get_file_name_from_initial_path()}</a>
                </p>

                <img src={`http://localhost:8000/media/${field.initial}`} alt="" style={{width:200, height:200, objectFit:"contain"}}/>
                
                <br/>
                <br/>
            </>
            }
            

            

            <div>
                <input name={field.name} type={field.type} required={required}
                onChange={event => formik.setFieldValue(field.name, event.target.files[0])}
                readOnly={field.readonly}
                />
            </div>

        
        </BaseField>
        
    </>
}



const ChoiceField = ({field,...props}) => {

    return <>
        <BaseField field={field}>
            <Field name={field.name} as={field.type} 
                    required={field.required} className="form-control form-select" 
                    multiple={field.multiple}
                    readOnly={field.readonly}
                    >

                    {field.choices.map((choice, idx) => {
                        return <option key={idx} value={choice[0]}>{choice[1]} </option>
                    })}
            </Field>
        </BaseField>
    </>
}



const TextAreaField = ({field, ...props}) => {

    return <>
    <BaseField field={field}>
        <textarea name={field.name} type={field.type} 
                required={field.required}
                className="form-control"
                defaultValue={field.initial}
                readOnly={field.readonly}
                />
    </BaseField>

    </>
}


const DefaultField = ({field, ...props}) => {
    return <>
        <BaseField field={field}>
        
            <Field name={field.name} type={field.type} 
                required={field.required}
                className="form-control"
                readOnly={field.readonly}/>

        </BaseField>
    </>
}



const CheckboxField = ({field, ...props}) => {
    //want it to make in one line in label so i dont use base field

    return <>
        <div>
            <span>
                <FieldLabel field={field}/>? <Field name={field.name} type={field.type} 
                                                    required={field.required} className="form-check-input" 
                                                    readOnly={field.readonly}/></span>
        </div>
          
           
    </>
}


export const GetField = (props) =>{
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