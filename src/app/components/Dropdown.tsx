'use client';
import React, { useState, useEffect } from 'react';
import styles from '@/resources/dropdown.module.css'
import Svg from '@/app/components/Svg'

interface Props {
    val: any,
    api: string, 
    type: string
}


function Dropdown(prop:Props) {
    const [inputValue, setInputValue] = useState('');

    const [data, setData] = useState<any>([])
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<any>(null);




    useEffect(() => {
  
        const fetchData = async () => {
            try {
                const response = await fetch(prop.api);  
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const results = await response.json();
                setData (results)
            } catch (err) {
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);
  
    if (isLoading) {
        return (
            <div className = "flex-3 bg-white flex px-20 flex-col my-50 items-center">
                Loading...
            </div>
        );
    }
  
    if (error) {
        return (
           <div className = "flex-3 bg-white flex px-20 flex-col my-50 items-center">Error: {error.message}</div>
        );
    }

    const searchResult = (search:string) => {
        var results_eles 
        results_eles =  document.querySelectorAll('#' + prop.type + '_results div');

        if (results_eles) {
            results_eles.forEach( el => {
                el.classList.add('hide')
            
                if (el.innerHTML.toUpperCase().indexOf(search.toUpperCase()) >= 0) {
                    el.classList.remove('hide')
                }

            });
        }
        
    }

    const handleInputChange = (event:any) => {
        const val = event.target.value

        if (val.length > 0) {
            searchResult(val)
        } else {
            showResultsBox()
        }
        setInputValue(val);
    };

    const showResultsBox = () => {
        var results, wrapper, dropdownInput, results_eles, arrow

        wrapper = document.getElementById(prop.type);
        arrow = document.querySelector('#' + prop.type + '_arrow svg');
        results = document.querySelector('#' + prop.type + '_results')
        results_eles = document.querySelectorAll('#' + prop.type  + '_results div')
        dropdownInput = document.querySelector('#' + prop.type + '_dropinput')

        wrapper?.classList.add('sendtofront');

        results?.classList.remove('hide');

        results_eles.forEach( el => {
            el.classList.remove('hide')
        })

        if (results.classList.contains('hide')) {
            if (arrow.classList.contains('rotate-270')) {
                arrow.classList.remove('rotate-270')    
            }
        } else {
            if (arrow.classList.contains('rotate-270') == false) {
                arrow.classList.add('rotate-270')
            }
        }

        if (dropdownInput) {
            dropdownInput.focus()
        }
    }

    const makeWebFriendly = (str:string) => {
        return str.replace(/ /g, '_')
    }


    const selectResult = (event:any) => {
        var selectValue, results, dropdownInput, wrapper, arrow
   
        wrapper = document.getElementById(prop.type);
        arrow = document.querySelector('#' + prop.type + '_arrow svg');
        results = document.querySelector('#' + prop.type + '_results')
        dropdownInput = document.getElementById(prop.type + '_dropinput');

        wrapper?.classList.remove('sendtofront');

        const html = event.target.innerHTML;
        if (html.length > 0 ) {
            if (dropdownInput) {
                dropdownInput.placeholder = html;
                dropdownInput.value = ''
            }

            results?.classList.add('hide');

            if (results.classList.contains('hide')) {
                arrow.classList.remove('rotate-270')    
            } else {
                arrow.classList.add('rotate-270')
            }
        }   

    }

    const arrowclick = (event) => {
        const ele = event.target
        const dropdownInput = document.getElementById(prop.type + '_dropinput');
        const results = document.querySelector('#' + prop.type + '_results')
     
        if (dropdownInput.value.length>0) {
            dropdownInput.value = ''
        }
        
        if (ele.classList.contains('rotate-270')) {
            
            setTimeout(function () {
                ele.classList.remove('rotate-270')
                results.classList.add('hide')
            },301)
        }

    }

    const getPlaceholder = () => {
        if (prop.val == '') {
            return 'Select Text'
        } else {
            return prop.val
        }
    }

    const getValue = () => {
        if (prop.type == 'clients') {
            return 'company_name'
        } else {
            return 'category_name'
        }
    }

    return (
        <div className = {styles.wrapper} id = {prop.type} >
            <div className = "flex flex-row" onClick= {showResultsBox}>
                <input
                    className = {styles.dropdown_input}
                    type="text"
                    name={'drop_' + getValue()}
                    id = {prop.type + '_dropinput'}
                    placeholder={getPlaceholder()}
                    onChange={handleInputChange}
                />
                <div className = {styles.selectValue} id = {prop.type + '_selectValue'}>{''}</div>
                <div className = {'arrow ' + styles.droparrow} id = {prop.type + '_arrow'} onClick={(e) => arrowclick(e)}>
                    <Svg type = 'downarrow' />
                </div>
            </div>
            
            <div className = {'border-t border-gray-300 hide ' + styles.results} id = {prop.type + '_results'}>
                {Object.entries(data).map(([key, value]) => (
                    <div key ={key} 
                        id = {'k' + makeWebFriendly(data[key][getValue()])} 
                        onClick={selectResult}
                        className = {styles.results_div}
                    >
                        {data[key][getValue()]}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Dropdown; 