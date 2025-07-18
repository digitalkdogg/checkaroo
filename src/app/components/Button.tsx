'use client';

import { useState, useEffect } from 'react';
import Loading from '@/app/components/Loading';
import { superEcnrypt, encrypt } from '@/common/crypt';

interface props {
    id: string
    className?: string
    onSubmit: (data: FormData) => void;
    text: string
    session: string
    url: string
    payload: [string] | [string, string]
    callBack: (data: {msg:string, status: string}) => void
}

export default function CustomButton({id, className, onSubmit, text, session, url, payload, callBack}: props) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(false)
    }, []);

    const createDataObj = (formData:FormData):string => {
        const dataobj: Record<string, FormDataEntryValue | null> = {};
        payload.forEach((item:string) => {
            dataobj[item] = formData.get(item)
        })
        return JSON.stringify(dataobj);
    }

    const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget.form as HTMLFormElement);
        setIsLoading(true)

        const data = createDataObj(formData);

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    session: superEcnrypt(session),
                    data: encrypt(data)
                })
            })

            if (!response.ok) {
                const json = await response.json();
                callBack({status:'error', msg: json.error})
                
            } else {
                const json = await response.json();
                if (json.status == 'success') {
                    callBack({status: 'success', msg: json.message})
                } else {
                    callBack({status:'error', 'msg': json.message})
                }
            }
            setIsLoading(false);
        } catch (err:unknown) {
            callBack({status:'error', 'msg': String(err) })
            setIsLoading(false);
        }
    };

    const getClassName = () => {
        if (className) {
            return 'btn ' + className
        } else {
            return 'btn'
        }
    }

      return (
        <div>
        <button id = {id} className = {getClassName()} type="button" onClick={handleClick}>
            {isLoading && <span className = "inline-flex relative top-1 -left-2" id = "loadingspan"><Loading size={6} /></span>}
            {text}
        </button>
        </div>
      );
    }