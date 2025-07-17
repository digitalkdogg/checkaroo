import React, { useState } from 'react';

interface Props {
    val: string,
    id: string,
    name: string,
    disabled: boolean
}

function Input(props:Props) {
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
                readOnly = {true}
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