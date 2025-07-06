import React, { useState } from 'react';

interface Props {
    val: any,
    id: string,
    name: string,
    disabled: boolean
}

function Input(props:Props) {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event:any) => {
    setInputValue(event.target.value);
  };

  if (inputValue) {
     return (
            <input
                id = {props.id}
                type="text"
                name ={props.name}
                defaultValue = {props.val}
                onChange={handleInputChange}
            />
        );
  }

    if (props.disabled==true) {
        return (
            <input
                id = {props.id}
                type="text"
                name={props.name}
                defaultValue = {props.val}
                onChange={handleInputChange}
                disabled = {true}
            />
        )    
    } else {
        return (
            <input
                id = {props.id}
                type="text"
                name ={props.name}
                defaultValue = {props.val}
                onChange={handleInputChange}
            />
        );
    }
}

export default Input;