
import { useState } from "react"
import { useField } from "formik"

import Select from 'react-select'

export const IsInStock = (props) => {
  return <>
  <h5 style={{color:props.piecesLeft ? "green" : "red"}}>
      {props.piecesLeft ? "In Stock": "Not In Stock"}
  </h5>
  <h5>Pieces Left: {props.piecesLeft}</h5>
  </>

}


export const Quantity = (props) => {
    const [dropdownValue, setDropdownValue] = useState(props.deafult ? 
                                    props.deafult : 
                                    1
                                    ) 

    const handleDropdownClick = (e) =>{
        setDropdownValue(e.target.innerText)
        props.setDropdownValue && props.setDropdownValue(e.target.innerText)
        props.extendHandle && props.extendHandle(e)
    }

    const QuanityArray = Array.from(Array(props.piecesLeft).keys())
    return <div className="dropdown-center">
        <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
        Quantity: {dropdownValue}
        </button>
        <ul className="dropdown-menu">

            {QuanityArray.map((key)=>{
                return <li  key={key+1}><button className="dropdown-item" onClick={handleDropdownClick}>{key+1}</button></li>
                })

            }

        </ul>
    </div>
}


export const SelectFieldFormik = ({ options, ...props }) => {
    const [field, , helpers] = useField(props.field.name);

    const handleChange = (selectedOption) => {
      helpers.setValue(selectedOption ? selectedOption.value : '');
    };
  
    const getValue = () => {
      return options ? options.find(option => option.value === field.value) : '';
    };
  
    return (
      <Select
        {...props}
        value={getValue()}
        onChange={handleChange}
        options={options}
      />
    );
  };



