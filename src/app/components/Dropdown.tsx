'use client';
import React, { useState, useEffect } from 'react';
import styles from '@/resources/dropdown.module.css'
import Svg from '@/app/components/Svg'
import Loading from '@/app/components/Loading'
import { superEcnrypt } from '@/common/crypt';

interface Props {
    val: any,
    api: string, 
    type: string,
    session : string
}

function Dropdown(prop:Props) {
    const [inputValue, setInputValue] = useState('');

    const [data, setData] = useState<any>([])
    const [isLoading, setIsLoading] = useState(true);
    const [errorDropDown, setErrorDropDown] = useState<any>(null);

    useEffect(() => {
  
        const fetchData = async () => {

            try {
                 const response = await fetch(prop.api, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        session: superEcnrypt(prop.session)
                    })
                })

                if (!response.ok) {
                    const err = await response.json();
                     setErrorDropDown({message: err.error});
                } else {
                    
                    const results = await response.json();
                    if (results == 'no results found here') {
                        setErrorDropDown({message: 'No Results Found'})
                    } else {
                        setData (results)
                    }
                }
            } catch (err) {
                setErrorDropDown(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

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
        var results:any, wrapper:any, dropdownInput:any, results_eles:any, arrow:any

        wrapper = document.getElementById(prop.type);
        arrow = document.querySelector('#' + prop.type + '_arrow svg');
        results = document.querySelector('#' + prop.type + '_results')
        results_eles = document.querySelectorAll('#' + prop.type  + '_results div')
        dropdownInput = document.querySelector('#' + prop.type + '_dropinput')

        wrapper?.classList.add('sendtofront');

        results?.classList.remove('hide');

        results_eles.forEach((el: any) => {
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
        if (str) {
            return str.replace(/ /g, '_')
        } else {
            return ''
        }
    }


    const selectResult = (event:any) => {
        var selectValue, results:any, dropdownInput:any, wrapper:any, arrow:any, hidden_input:any

        wrapper = document.getElementById(prop.type);
        arrow = document.querySelector('#' + prop.type + '_arrow svg');
        results = document.querySelector('#' + prop.type + '_results')
        dropdownInput = document.getElementById(prop.type + '_dropinput');
        hidden_input = document.getElementById(prop.type + '_hidden_input')

        wrapper?.classList.remove('sendtofront');

        const html = event.target.innerHTML;
        if (html.length > 0 ) {
            if (dropdownInput) {
                dropdownInput.placeholder = html;
                hidden_input.value = html
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

    const arrowclick = (event:any) => {
        const ele:any = event.target
        const dropdownInput:any = document.getElementById(prop.type + '_dropinput');
        const results:any = document.querySelector('#' + prop.type + '_results')
     
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

    if (isLoading) {
        return (
            <div className = "flex-3 bg-white flex px-20 flex-col items-center">
                <Loading size={6} />
            </div>
        );
    }

  
    if (errorDropDown) {
        return (
             <div className = {styles.wrapper} id = {prop.type} >
                <div className = "flex flex-row" >
                    <div className = "ml-5 mr-5">
                        {errorDropDown.message}
                    </div>
                </div>
           </div>
        );
    }

    return (
        <div className = {styles.wrapper} id = {prop.type} >
            <div className = "flex flex-row" onClick= {showResultsBox}>
                <input
                    className = {styles.dropdown_input}
                    type="text"
                    name={prop.type + '_dropinput'}
                    id = {prop.type + '_dropinput'}
                    placeholder={getPlaceholder()}
                    onChange={handleInputChange}
                />
                <input type = "hidden" id = {prop.type + '_hidden_input'} name = {prop.type + '_hidden_input'} />
                <div className = {'arrow ' + styles.droparrow} id = {prop.type + '_arrow'} onClick={(e) => arrowclick(e)}>
                    <Svg id = {prop.type + '_droparrow'} type = 'downarrow' />
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