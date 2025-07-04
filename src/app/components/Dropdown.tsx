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

    const [addData, setAddData] = useState<any>(false)
    const [isAddLoading, setIsAddLoading] = useState(false);
    const [errorAddDropDown, setErrorAddDropDown] = useState<any>(null);
    const [successAddDropDown, setSuccessAddDropDown] = useState<any>(null);

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

    useEffect(() => {
        fetchData();
    }, []);

    const searchResult = (search:string) => {
       // var results_eles 
        const results_eles =  document.querySelectorAll('#' + prop.type + '_results div');

        if (results_eles) {
            results_eles.forEach( el => {
                if (el.classList.contains('donothide') == false) {
                    el.classList.add('hide')
                }
            
                if (el.innerHTML.toUpperCase().indexOf(search.toUpperCase()) >= 0) {
                    el.classList.remove('hide')
                }

            });
        }
    }

    const handleInputChange = (event:any) => {
        const val = event.target.value
        const addrow = document.querySelector('#' + prop.type + ' #addrow');
        if (val.length > 0) {
            searchResult(val)
            addrow?.classList.remove('notvisible')
            addrow?.setAttribute('data-value', val);
            setAddData(true);
        } else {
            showResultsBox()
            setAddData(false);
            addrow?.classList.add('notvisible')
            addrow?.setAttribute('data-value', '');
        }
        setInputValue(val);
    };

    const hideResultsBox = () => {
        const results = document.querySelector('#' + prop.type + '_results')
        const results_eles = document.querySelectorAll('#' + prop.type  + '_results div')
        const wrapper = document.getElementById(prop.type);
        const arrow = document.querySelector('#' + prop.type + '_arrow svg');

        results_eles.forEach((el: any) => {
            el.classList.remove('hide')
        })

        if (results && arrow) {
            results?.classList.add('hide');
                if (arrow.classList.contains('rotate-270')) {
                    arrow.classList.remove('rotate-270')    
                    wrapper?.classList.remove('absolute');
                    if (prop.type == 'categories') {
                        const otherarrow = document.querySelector('#clients #clients_arrow');
                        if (otherarrow) {
                            otherarrow.classList.remove('sendtoback');
                        }
                    } else {
                        const otherarrow = document.querySelector('#categories #categories_arrow');
                        if (otherarrow) {
                            otherarrow.classList.remove('sendtoback');
                        }
                    }
                }
        }

    }

    const showResultsBox = () => {
        var results:any, wrapper:any, dropdownInput:any, results_eles:any, arrow:any, arrowwrap:any;


        wrapper = document.getElementById(prop.type);
        arrow = document.querySelector('#' + prop.type + '_arrow svg');
        arrowwrap = document.querySelector('#' + prop.type + '_arrow');
        results = document.querySelector('#' + prop.type + '_results')
        results_eles = document.querySelectorAll('#' + prop.type  + '_results div')
        dropdownInput = document.querySelector('#' + prop.type + '_dropinput')

        if (results.classList.contains('hide') == false) {
            return;
        }
        console.log('show results box')
            setSuccessAddDropDown(false);
            setErrorAddDropDown(false);
            setAddData(false);

            wrapper?.classList.add('expand');
            wrapper?.classList.add('absolute');

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
                    if (prop.type == 'categories') {
                        const otherarrow = document.querySelector('#clients #clients_arrow');
                        if (otherarrow) {
                            otherarrow.classList.add('sendtoback');
                        }
                    } else {
                        const otherarrow = document.querySelector('#categories #categories_arrow');
                        if (otherarrow) {
                            otherarrow.classList.add('sendtoback');
                        }
                    }
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

        wrapper?.classList.remove('expand');

        const html = event.target.innerHTML;
        if (html.length > 0 ) {
            if (dropdownInput) {
                dropdownInput.placeholder = html;
                hidden_input.value = html
                dropdownInput.value = ''
            }

            hideResultsBox();
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

    const addThing = async (event:any) => {
        console.log('add thing')
        var target; 
        if (event.target.nodeName=='svg') {
            target = event.target.parentNode;
        } else if (event.target.nodeName=='path') {
            target = event.target.parentNode.parentNode;    
        } else if (event.target.nodeName=='span' || event.target.nodeName=='SPAN') {
            target = event.target;
        }

        if (addData) {
            if (target) {
                setIsAddLoading(true);
                setErrorAddDropDown(null);
                setSuccessAddDropDown(false);
                
                const val = target.getAttribute('data-value'); 
                const input:any = document.getElementById(prop.type + '_dropinput');
                const results = document.querySelector('#' + prop.type + '_results')

                const response = await fetch(prop.api + '/add', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        session: superEcnrypt(prop.session),
                        data: {value: val}
                    })
                }).then(async (res:any) => {
                    if (res.ok) {
                        const json = await res.json();
                        if (json.status === 'success') {
                            setIsAddLoading(false);
                            setSuccessAddDropDown(true);
                            setAddData(false);
                            const arrow = document.querySelector('#' + prop.type + '_arrow svg');
                            input.value = '';
                            input.placeholder = val;
                            const hidden_input:any = document.getElementById(prop.type + '_hidden_input');
                            hidden_input.value = val;
                            hideResultsBox();
                            fetchData()
                            setTimeout(() => {
                                setSuccessAddDropDown(false);
                            }, 5000); 

                        } else {
                            throw new Error(json.message);
                        }
                    } else {
                        const err = await res.json();
                        throw new Error(err.error);
                    }
                }).catch((err:any) => {
                    setIsAddLoading(false);
                    setAddData(false);
                    setErrorAddDropDown({message: err.message});
                    hideResultsBox();
                    console.error('Error adding item:', err);
                });
            }
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
        <div className = {'dropdown-wrapper ' + styles.wrapper} id = {prop.type} >
            <div className = "flex flex-row" onClick= {showResultsBox}>
                <span className={styles.addrow + " inline-flex text-base notvisible"} id = "addrow" onClick={addThing} data-value = ''>
                    {addData && <Svg type = "add" id = "add" />}
                    {isAddLoading && <Loading size={24} />}
                    {errorAddDropDown && <Svg type = "x-circle" id = "error" class="error" />}
                    {successAddDropDown && <Svg type = "success" id = "success" class="success" />}
                </span>
                <input
                    className = {styles.dropdown_input}
                    type="text"
                    name={prop.type + '_dropinput'}
                    id = {prop.type + '_dropinput'}
                    placeholder={getPlaceholder()}
                    onChange={handleInputChange}
                />
                <input type = "hidden" id = {prop.type + '_hidden_input'} name = {prop.type} />
                <div className = {'arrow ' + styles.droparrow} id = {prop.type + '_arrow'} onClick={(e) => arrowclick(e)}>
                    <Svg id = {prop.type + '_droparrow'} type = 'downarrow' />
                </div>
            </div>
            
            <div className = {'hide ' + styles.results} id = {prop.type + '_results'}>
               
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