import React, { useState } from 'react';

interface Props {
    val: string,
    id: string,
    name: string,
    disabled: boolean
}

function Input(props:Props) {
    const [inputValue, setInputValue] = useState('');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                    autoComplete='true'
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
                autoComplete='false'
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
                autoComplete='true'
            />
        );
    }
}

export default Input;