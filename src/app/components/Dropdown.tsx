'use client';
import React, { useState, useEffect } from 'react';
import styles from '@/resources/dropdown.module.css'
import Svg from '@/app/components/Svg'
import Loading from '@/app/components/Loading'
import { superEcnrypt, encrypt } from '@/common/crypt';
import { decodeHtmlEntities } from '@/common/common';

interface Props {
    val: string,
    api: string, 
    type: string,
    session : string
}

function Dropdown(prop:Props) {
    const [inputValue, setInputValue] = useState('');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [data, setData] = useState<any>([])
    const [isLoading, setIsLoading] = useState(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [errorDropDown, setErrorDropDown] = useState<any>(null);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [addData, setAddData] = useState<any>(false)
    const [isAddLoading, setIsAddLoading] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [errorAddDropDown, setErrorAddDropDown] = useState<any>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [successAddDropDown, setSuccessAddDropDown] = useState<any>(null);


    const [resultEles, setResultEles] = useState<NodeListOf<HTMLElement> | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [addRow, setAddRow] = useState<any>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [results, setResults] = useState<any>(null);
    const [wrapper, setWrapper] = useState<HTMLElement | null>(null);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [arrow, setArrow] = useState<any>(null);
   const [hiddenValue, setHiddenValue] = useState<string | null>(prop.val || 'Select Text');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [dropdownInput, setDropDownInput] = useState<any>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [otherArrow, setOtherArrow] = useState<any>(null);

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
                
                const data = await response.json();
                if (data == 'no results found here') {
                    setErrorDropDown({message: 'No Results Found'})
                } else {
                    setData (data)
                    setTimeout(function () {
                        init()
                    }, 200);
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

    const init = () => {
        setAddRow(document.querySelector('#' + prop.type + ' #addrow'));
        setResultEles(document.querySelectorAll('#' + prop.type + '_results div'));
        setResults(document.querySelector('#' + prop.type + '_results'));
        setWrapper(document.getElementById(prop.type));
        setArrow(document.querySelector('#' + prop.type + '_arrow svg'));
        setDropDownInput(document.getElementById(prop.type + '_dropinput'));
        getOtherArrow()
      
    }

    const getOtherArrow= () => {
        if (prop.type == 'clients') {
            setOtherArrow(document.querySelector('#categories #categories_arrow'));
            return document.querySelector('#categories #categories_arrow')
        } else {
            setOtherArrow(document.querySelector('#clients #clients_arrow'));
            return document.querySelector('#clients #clients_arrow')
        }
    }

    const searchResult = (search:string) => {
        if (resultEles) {
            resultEles.forEach((el: HTMLElement) => {
                if (el.classList.contains('donothide') == false) {
                    el.classList.add('hide')
                }
                if (el.innerHTML.toUpperCase().indexOf(search.toUpperCase()) >= 0) {
                    el.classList.remove('hide')
                }
            });
        }
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const val = event.target.value;

        if (val.length > 0) {
            searchResult(val);
            addRow?.classList.remove('notvisible');
            addRow?.setAttribute('data-value', val);
            setAddData(true);
        } else {
            showResultsBox();
            setAddData(false);
            addRow?.classList.add('notvisible');
            addRow?.setAttribute('data-value', '');
        }

        setInputValue(val);

        if (inputValue) {
            return;
        }
    };

    const hideResultsBox = () => {

        resultEles?.forEach((el) => {
            el.classList.remove('hide');
        });

        if (results && arrow) {
            otherArrow.classList.remove('sendtoback');
            results?.classList.add('hide');
            if (arrow.classList.contains('rotate-270')) {
                arrow.classList.remove('rotate-270')    
                wrapper?.classList.remove('absolute');
                
            }
        }

    }

    const showResultsBox = () => {
        if (results) {
            if (results.classList.contains('hide') == false) {
                return;
            }
        }

        setSuccessAddDropDown(false);
        setErrorAddDropDown(false);
        setAddData(false);

        wrapper?.classList.add('expand');
        wrapper?.classList.add('absolute');

        results?.classList.remove('hide');

        resultEles?.forEach((el) => {
            el.classList.remove('hide');
        });

        if (results) {
            if (results.classList.contains('hide')) {
                if (arrow.classList.contains('rotate-270')) {
                    arrow.classList.remove('rotate-270')    
                }
            } else {
                if (arrow.classList.contains('rotate-270') == false) {
                    if (otherArrow) {
                        otherArrow.classList.add('sendtoback');
                    }    
                    arrow.classList.add('rotate-270')
                    
                }
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

    const selectResult = (event: React.MouseEvent<HTMLDivElement>) => {
        wrapper?.classList.remove('expand');

        const target = event.target;
        if (target instanceof HTMLElement) {
            const html = target.innerHTML;

            if (html.length > 0) {
                if (dropdownInput) {
                    if (html.length >0 ) {
                        dropdownInput.placeholder = decodeHtmlEntities(html);
                        setHiddenValue(decodeHtmlEntities(html));
                    }

                    dropdownInput.value = '';
                }
                hideResultsBox();
            }
        }
    };


    const arrowclick = (event: React.MouseEvent<HTMLDivElement>) => {
        const ele = event.target as HTMLElement;
        const dropInput = document.getElementById(`${prop.type}_dropinput`) as HTMLInputElement | null;

        if (dropInput && dropInput.value.length > 0) {
            dropInput.value = '';
        }

        if (ele.classList.contains('rotate-270')) {
            setTimeout(() => {
                ele.classList.remove('rotate-270');
                otherArrow.classList.remove('sendtoback');
                if (results) {
                    results.classList.add('hide');
                }
            }, 301);
        }
    };

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

    const getAddItemValue = (val:string | undefined) => {
        if (prop.type=='clients') {
            return JSON.stringify({ClientName: val})
        } else {
            return JSON.stringify({CategoryName: val})
        }
    }

    const addItem = async (event: React.MouseEvent<HTMLElement>) => {
        let target: HTMLElement;
        const nodeName = (event.target as HTMLElement).nodeName;

        if (nodeName === 'svg') {
            target = (event.target as HTMLElement).parentNode as HTMLElement;
        } else if (nodeName === 'path') {
            target = (event.target as HTMLElement).parentNode?.parentNode as HTMLElement;
        } else if (nodeName.toLowerCase() === 'span') {
            target = event.target as HTMLElement;
        } else {
            throw new Error('Unsupported element type');
        }


        if (addData) {
            if (target) {
                setIsAddLoading(true);
                setErrorAddDropDown(null);
                setSuccessAddDropDown(false);
                
                const val = decodeHtmlEntities(target.getAttribute('data-value')); 

                if (!val) {
                    throw new Error('Missing data-value attribute');
                }

                await fetch(prop.api+ '/add', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        session: superEcnrypt(prop.session),
                        data: encrypt(getAddItemValue(val))
                    })
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                }).then(async (res:any) => {
                    if (res.ok) {
                        const json = await res.json();
                        if (json.status === 'success') {
                            setIsAddLoading(false);
                            setSuccessAddDropDown(true);
                            setAddData(false);
                            dropdownInput.value = '';
                            dropdownInput.placeholder = val;
                            setHiddenValue(val);
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
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                <span className={styles.addrow + " inline-flex text-base notvisible"} id = "addrow" onClick={addItem} data-value = ''>
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
                <input type = "hidden" id = {prop.type + '_hidden_input'} name = {prop.type} value={hiddenValue?? 'Select Text'}/>
                <div className = {'arrow ' + styles.droparrow} id = {prop.type + '_arrow'} onClick={(e) => arrowclick(e)}>
                    <Svg id = {prop.type + '_droparrow'} type = 'downarrow' />
                </div>
            </div>
            
            <div className = {'hide ' + styles.results} id = {prop.type + '_results'}>
               
                {Object.entries(data).map(([key]) => (
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