'use client'
import { useState, useEffect } from 'react';
import Input from '@/app/components/Input';
import {convertToNiceDate, formatDouble} from '@/common/common'
import Dropdown from '@/app/components/Dropdown'
import Error from '@/app/components/Error'
import styles from '@/resources/dropdown.module.css'
import Datepicker from '@/app/components/Datepicker';
import { encrypt, superEcnrypt } from '@/common/crypt';
import Loading from '@/app/components/Loading';


interface Props {
    transid : string,
    session: string
}

interface Trans {
    account_id : number,
    amount: number,
    category_id: number,
    category_name: string,
    client_id: number,
    company_name:string, 
    date: Date,
    trans_id: string
}

interface Err {
    message: string
}

export default function Dets(props:Props) {
    const [data, setData] = useState<any>([])
    const [isLoading, setIsLoading] = useState(true);
    const [errorTrans, setErrorTrans] = useState<any>(null);

    const [saveDate, setSaveDate] = useState();
    const [isSaveLoading, setIsSaveLoading] = useState(false)
    const [errorSaveData, setErrorSaveData] = useState<any>(null)

    const saveData = async (e:any) => {
        e.preventDefault()
        setIsSaveLoading(true)

        const formData = new FormData(e.currentTarget);

        const date = formData.get('date');
        const clients = formData.get('clients');
        const amount = formData.get('amount');
        const categories = formData.get('categories'); 
        const transid = props.transid

        const data = JSON.stringify({date: date, clients: clients, amount:amount, categories: categories, transid:transid})
        console.log(data);

        const response = await fetch('/api/transaction/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                session: superEcnrypt(props.session),
                data: encrypt(data)
            })
        })

        console.log(response);

        if (!response.ok) {
            
        } else {

        }

    }

    useEffect(() => {
        const fetchData = async () => {
            try {

                const response = await fetch('/api/transaction', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    session: superEcnrypt(props.session),
                    transid: encrypt(props.transid)
                  })
                })

                if (!response.ok) {
                    const err = await response.json();
                     setErrorTrans({message: err.error});
                } else {
                  const result = await response.json();
                  if (result=='no results found here') {
                    setErrorTrans({message: 'No Transaction Details Found'})
                  } else {
                    setData(result)
                  }
                }
            } catch (err:any) {
                setErrorTrans(err);
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

    if (errorTrans) {
        return (
         <Error value = {errorTrans.message} /> 
        );
    }

    return (
        <div>
            <form  onSubmit={saveData} className = "flex-3 bg-white flex flex-col my-50 max-w-130 justify-left" >
                <div className = "flex flex-col md:flex-row py-5">
                    <span className = "md:basis-32">TransID :</span>
                     <Input name = "transid" id = "transid" val = {data.trans_id} disabled = {true} />
                </div>
                <div className = "flex flex-col md:flex-row py-5">
                    <span className="md:basis-32">Date :</span>
                    <Datepicker id = "date" name = "date" val={convertToNiceDate(data.date)} />
                </div>
                <div className = "flex flex-col md:flex-row py-5">
                    <span className = "md:basis-32">Amount :</span>
                     <Input name = "amount" id = "amount" val = {formatDouble(data.amount) as string} disabled = {false} />
                </div>
                <div className = {'flex flex-col md:flex-row py-5 ' + styles.container}>
                    <span className = "md:basis-32">Company : </span>
                    <div className="flex">
                        <Dropdown val = {data.company_name} api = "../api/clients" type = 'clients' session = {props.session} />
                    </div>
                </div>
                <div className = {'flex flex-col md:flex-row py-5 ' + styles.container}>
                    <span className = "md:basis-32">Category : </span>
                    <div className="flex">
                        <Dropdown val = {data.category_name} api = "../api/categories" type = 'categories' session = {props.session} />
                    </div>
                </div>
                <div className= "flex flex-col sm:flex-row justify-center-safe mb-10 mt-10">
                    <button className="inset-shadow-indigo-500 sm:mr-5" type="submit">
                        {isSaveLoading && <span className = "inline-flex relative top-1 -left-2" id = "loadingspan"><Loading size={6} /></span>}
                        Submit
                    </button>
                    <button className="sm:ml-5" type="reset">Reset</button>
                </div>
            </form>
        </div>
    );
}