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
        
        if (prop.type == 'clients') {
            results_eles =  document.querySelectorAll('#clients #results div');
        } else {
            results_eles = document.querySelectorAll('#categories #results div');
        }

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
        var results, wrapper, dropdownInput, results_eles


        if (prop.type == 'clients') {
            results = document.querySelector('#clients #results')
            wrapper = document.getElementById('clients');
            dropdownInput = document.querySelector('#clients #cldropdown_input')
            results_eles = document.querySelectorAll('#clients #results div')
   
        } else {
            results = document.querySelector('#categories #results')
            wrapper = document.getElementById('categories');
            dropdownInput = document.querySelector('#categories #cadropdown_input')
            results_eles = document.querySelectorAll('#categories #results div')
        }


        wrapper?.classList.add('sendtofront');

        results_eles.forEach( el => {
            el.classList.remove('hide')
        })

        results?.classList.remove('hide');
        if (dropdownInput) {
            dropdownInput.classList.remove('sendtoback')
        }
    }

    const makeWebFriendly = (str:string) => {
        return str.replace(/ /g, '_')
    }

    const selectResult = (event:any) => {
        var selectValue, results, dropdownInput, wrapper
   

        if (prop.type == 'clients') {
            selectValue = document.querySelector('#clients #selectValue')
            wrapper = document.getElementById('clients');
            results = document.querySelector('#clients #results')
            dropdownInput = document.getElementById('cldropdown_input');
        } else {
            selectValue = document.querySelector('#categories #selectValue')
            wrapper = document.getElementById('categories');
            results = document.querySelector('#categories #results')
            dropdownInput = document.getElementById('cadropdown_input');
        }

        wrapper?.classList.remove('sendtofront');

        const html = event.target.innerHTML;
        if (selectValue) {
            if (html.length > 0 ) {
                selectValue.innerHTML = html;
                if (dropdownInput) {
                    dropdownInput.classList.add('sendtoback')
                    dropdownInput.focus()
                }

                results?.classList.add('hide');
            }   
        }

    }


   if (prop.type == 'clients') {
        return (
            <div className = {styles.wrapper} id = "clients">
                <div className = "flex flex-row" onClick= {showResultsBox}>
                  <input
                      className = {'sendtoback ' + styles.dropdown_input}
                      type="text"
                      id = "cldropdown_input"
                      onChange={handleInputChange}
                  />
                  <div className = {styles.selectValue} id = "selectValue">{prop.val}</div>
                  <div className = {styles.droparrow}>
                    <Svg type = 'downarrow' />
                  </div>
                </div>
                
                <div className = {'border-t border-gray-300 hide ' + styles.results} id = "results">
                    {Object.entries(data).map(([key, value]) => (
                    <div key={key} id = {'k_' + makeWebFriendly(data[key].company_name)} onClick={selectResult} className = {styles.results_div}>
                        {data[key].company_name}
                    </div>
                    ))}
                </div>
            </div>
        )
    } else if(prop.type == 'categories') {
          return (
            <div className = {styles.wrapper} id = "categories">
                <div className = "flex flex-row " onClick= {showResultsBox}>
                  <input
                      className = {'sendtoback ' + styles.dropdown_input}
                      type="text"
                      id = "cadropdown_input"
                      onChange={handleInputChange}
                  />
                  <div className = {styles.selectValue} id = "selectValue">{prop.val}</div>
                  <div className = {styles.droparrow}>
                    <Svg type = 'downarrow' />
                  </div>
                </div>
                
                <div className = {'border-t border-gray-300 hide ' + styles.results} id = "results">
                    {Object.entries(data).map(([key, value]) => (
                    <div key={key} id = {'k_' + makeWebFriendly(data[key].category_name)} onClick={selectResult} className = {styles.results_div}>
                        {data[key].category_name}
                    </div>
                    ))}
                </div>
            </div>
          )
    }

}

export default Dropdown; 