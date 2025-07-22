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
import { useRouter } from 'next/navigation';
import CustomButton from '@/app/components/Button'


interface Props {
    transid : string,
    session: string
}


interface Callback {
    msg: string
    status: string
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

    const [saveDataRes, setSaveDataRes] = useState<string|null>();
    const [errorSaveData, setErrorSaveData] = useState<string|null>()
    const router = useRouter();

    const handleCallBack = (callbackdata: Callback) => {
      setErrorSaveData(null)
      setSaveDataRes(null)
      if (callbackdata.status == 'error'){
          setErrorSaveData(callbackdata.msg);
      } else if (callbackdata.status == 'success') {
          setSaveDataRes(callbackdata.msg)
          setTimeout(()=> {
            router.push('/')
          },1000)
      } else {
          setErrorSaveData('There was an unknown error that occured')
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
            } catch (err: unknown) {
                setErrorTrans(err as Err);
            } finally {
                setIsLoading(false);
                console.log(data)
            }
        };
        fetchData();
    }, []);

    const handleResetCallBack = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const date = document.getElementById('date') as HTMLInputElement | null;
        if (date) {
            //date.value = convertToNiceDate(data?.date.toString()) ?? '';
        }
        const amount = document.getElementById('amount') as HTMLInputElement | null;
        if (amount) {
            amount.value = data?.amount.toString() ?? '';
        }

        const client = document.getElementById('clients_dropinput') as HTMLInputElement | null;
        const clienthidden = document.getElementById('clients_hidden_input') as HTMLInputElement | null;
        if (client && clienthidden) {
            client.placeholder = data?.company_name ?? '';
            clienthidden.value = data?.company_name ?? '';
        }

        const cat = document.getElementById('categories_dropinput') as HTMLInputElement | null;
        const cathidden = document.getElementById('categories_hidden_input') as HTMLInputElement | null;
        if (cat && cathidden) {
            cat.placeholder = data?.category_name ?? '';
            cathidden.value = data?.category_name ?? '';
        }
    };

    if (isLoading) {
        return (
            <div className = "flex-3 bg-white flex px-20 flex-col my-50 items-center">
                <Loading />
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
            <form className = "flex-3 bg-white flex flex-col my-50 max-w-130 justify-left" >
                <div className = "flex flex-col md:flex-row py-5">
                    <span className = "md:basis-32">TransID :</span>
                     <Input name = "transid" id = "transid" val = {data?.trans_id ?? ''} disabled = {true} />
                </div>
                <div className = "flex flex-col md:flex-row py-5">
                    <span className = "md:basis-32">Date :</span>
                    <Datepicker id = "date" name = "date" val={getDate(data?.date)} />
                </div>
                <div className = "flex flex-col md:flex-row py-5">
                    <span className = "md:basis-32">Amount :</span>
                     <Input name = "amount" id = "amount" val = {getAmount(data?.amount !== undefined ? String(data.amount) : '') || ''} disabled = {false} />
                </div>
                <div className = {'flex flex-col md:flex-row py-5 ' + styles.container}>
                    <span className = "md:basis-32">Company : </span>
                    <div className="flex">
                        <Dropdown val = {data?.company_name ?? ''} api = "../api/clients" type = 'clients' session = {props.session} />
                    </div>
                </div>
                <div className = {'flex flex-col md:flex-row py-5 ' + styles.container}>
                    <span className = "md:basis-32">Category : </span>
                    <div className="flex">
                        <Dropdown val = {data?.category_name ?? ''} api = "../api/categories" type = 'categories' session = {props.session} />
                    </div>
                </div>
                <div className= "flex flex-col sm:flex-row justify-center-safe mb-10 mt-10">
                     <CustomButton 
                        id = "updateTrans"
                        className = "mr-5"
                        text = "Update Trans" 
                        session={props.session} 
                        url="/api/transaction/update" 
                        payload = {['date','clients', 'amount', 'categories', 'transid']}
                        callBack= {handleCallBack} />
                    <button className="sm:ml-5" type="reset" onClick={handleResetCallBack}>Reset</button>
                </div>
                <div className= "flex flex-col sm:flex-row justify-center-safe">
                    {saveDataRes && <div className="success mt-5">{saveDataRes}</div>}
                     {errorSaveData && <div className="error mt-5">{errorSaveData}</div>}
                </div>

            </form>
        </div>
    );
}