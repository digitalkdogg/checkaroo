'use client'
import { useState, useEffect } from 'react';
import Input from '@/app/components/Input';
import {convertToNiceDate, formatDouble} from '@/common/common'
import Dropdown from '@/app/components/Dropdown'
import Error from '@/app/components/Error'
import styles from '@/resources/dropdown.module.css'
import { encrypt, superEcnrypt } from '@/common/crypt';


interface Props {
    transid : string,
    session: string
}

export default function Dets(props:Props) {

    const [data, setData] = useState<any>([])
    const [isLoading, setIsLoading] = useState(true);
    const [errorTrans, setErrorTrans] = useState<any>(null);

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
            } catch (err) {
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
        <div >
            <div className = "flex-3 bg-white flex flex-col my-50 max-w-130" >
                <div className = "flex flex-row justify-between py-5">
                    <span>TransID :</span>
                     <Input name = "transid" id = "transid" val = {data.trans_id} disabled = {true} />
                </div>

                <div className = "flex flex-row justify-between py-5">
                    <span>Date :</span>
                     <Input name = "date" id = "date" val = {convertToNiceDate(data.date)} disabled = {false} />
                </div>
                <div className = "flex flex-row justify-between py-5">
                    <span>Amount :</span>
                     <Input name = "amount" id = "amount" val = {formatDouble(data.amount)} disabled = {false} />
                </div>
                <div className = {'flex flex-row py-5 ' + styles.container}>
                    <span>Company : </span>
                    <div className="flex">
                        <Dropdown val = {data.company_name} api = "../api/clients" type = 'clients' session = {props.session} />
                    </div>
                </div>
                <div className = {'flex flex-row py-5 ' + styles.container}>
                    <span>Category : </span>
                    <div className="flex">
                        <Dropdown val = {data.category_name} api = "../api/categories" type = 'categories' session = {props.session} />
                    </div>
                </div>
            </div>
        </div>
    );
}