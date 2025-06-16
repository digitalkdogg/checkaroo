import React, { useState } from 'react';

interface Props {
    val: any,
    id: string,
    disabled: boolean
}

function Input(props:Props) {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event:any) => {
    setInputValue(event.target.value);
  };

    if (props.disabled==true) {
        return (
            <input
                id = {props.val}
                type="text"
                defaultValue = {props.val}
                onChange={handleInputChange}
                disabled = {true}
            />
        )    
    } else {
        return (
            <input
                id = {props.val}
                type="text"
                defaultValue = {props.val}
                onChange={handleInputChange}
            />
        );
    }
}

export default Input;