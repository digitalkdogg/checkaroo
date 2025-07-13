'use client'
import { useState, useEffect } from 'react';
//import Input from '@/app/components/Input';
import {convertToNiceDate, formatDouble} from '@/common/common'
//import Dropdown from '@/app/components/Dropdown'
import Error from '@/app/components/Error'
//import styles from '@/resources/dropdown.module.css'
//import Datepicker from '@/app/components/Datepicker';
import { encrypt, superEcnrypt } from '@/common/crypt';
//import Loading from '@/app/components/Loading';
import { useRouter } from 'next/navigation';


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
    const [data, setData] = useState<Trans>()
    const [isLoading, setIsLoading] = useState(true);
    const [errorTrans, setErrorTrans] = useState<Err>();

    const [saveDataRes, setSaveDataRes] = useState();
    const [isSaveLoading, setIsSaveLoading] = useState(false)
    const [errorSaveData, setErrorSaveData] = useState<string>()
    const router = useRouter();

    const saveData = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSaveLoading(true)

        const formData = new FormData(e.currentTarget);

        const date = formData.get('date');
        const clients = formData.get('clients');
        const amount = formData.get('amount');
        const categories = formData.get('categories'); 
        const transid = props.transid

        const data = JSON.stringify({date: date, clients: clients, amount:amount, categories: categories, transid:transid})

        const response = await fetch('/api/transaction/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                session: superEcnrypt(props.session),
                data: encrypt(data)
            })
        })

        setIsSaveLoading(false)
        if (!response.ok) {
            setErrorSaveData('Error saving data')
        } else {
           const json = await response.json();
           if (json.status == 'success') {
                setSaveDataRes(json.message);
                setTimeout(() => {
                    router.push('/');
                },3000)
           }

        }

    }

    useEffect(() => {
        const fetchData = async () => {
            try {

                const response = await fetch('/api/clients', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    session: superEcnrypt(props.session),
                 //   transid: encrypt(props.transid)
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
            } catch (err: unknown) {
                setErrorTrans(err as Err);
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

    const getDate = (date: Date | string | undefined) => {
        if (!date) return undefined;
        if (typeof date === 'string') {
            return convertToNiceDate(date);
        }
        // If date is a Date object, convert to ISO string or desired format
        return convertToNiceDate(date.toISOString());
    }

    const getAmount = (amount: string) => {
        if (amount) {
            return formatDouble(Number(amount));
        } else {
            return '';
        }
    }

    return (
        <div>
            testing
        </div>
    );
}