'use client'
import { useState, useEffect, ReactHTMLElement } from 'react';
import Input from '@/app/components/Input';
import { superEcnrypt, encrypt } from '@/common/crypt';
import Error  from '@/app/components/Error';
import Loading from '@/app/components/Loading'
import { useRouter } from 'next/navigation';
import Button from '@/app/components/Button'

interface Props {
    clientid : string,
    session: string
}

interface Client {
    account_id : number,
    client_id: string,
    company_name: string
}

interface Err {
    message: string
}

interface Callback {
    msg: string
    status: string
}

export default function Dets({ clientid, session }: Props) {
    const [data, setData] = useState<Client | null>(null)
    const [isLoading, setIsLoading] = useState(true);
    const [errorClient, setErrorClient] = useState<Err>();


    const router = useRouter();

    const encryptedSession = superEcnrypt(session);
    const encryptedId = encrypt(clientid);

    const fetchClients = async () => {
        try {
            const res = await fetch('/api/clients/id', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ session: encryptedSession, id: encryptedId }),
            });

            const json = await res.json();

            if (!res.ok || json.error) {
                setErrorClient({message: json.error || 'Error fetching category'});
            } else {
                if (json.err) {
                    setErrorClient(json.err)
                }
                if (json.length > 0) {
              
                    if (json[0] == 'no results found here') {
                       setErrorClient({message: json[0]})
                    } else {
                        setData(json[0]);
                    }
                }
            }
        } catch (err) {
             setErrorClient({ message: (err as Error).message });
        } finally {
            setIsLoading(false);
        }
    };

    const [errorEvent, setErrorEvent] = useState<string>();
    const [successEvent, setSuccessEvent] = useState<string>();
    
    const handleCallBack = (callbackdata: Callback) => {
        if (callbackdata.status == 'error'){
            setErrorEvent(callbackdata.msg);
        } else if (callbackdata.status == 'success') {
            setSuccessEvent(callbackdata.msg)
            setTimeout(() => {
                router.push('/clients')
            },1000)
        } else {
            setErrorEvent('There was an unknown error that occured')
        }
    }

     const handleClick = () => {
        return
    };


    useEffect(() => {
        fetchClients();
    },[]);

    if (isLoading) {
        return (
           <Loading />
        )
    }

    if (errorClient) {
        return (
            <div className = "flex-3 bg-white flex flex-col my-50 max-w-130 justify-center" >
                <Error value = {errorClient.message} />
            </div>
        )
    }

    if (!data) return null;

    return (
        <div>
            <form id = "catForm"  className = "flex-3 bg-white flex flex-col my-50 max-w-130 justify-left" >
                <div className = "flex flex-col md:flex-row py-5">
                    <span className = "md:basis-32">ClientID :</span>
                        <Input name = "clientid" id = "clientid" val = {data.client_id} disabled = {true} />
                </div>
                <div className = "flex flex-col md:flex-row py-5">
                    <span className = "md:basis-32">Client Name :</span>
                        <Input name = "clientname" id = "clientname" val = {data.company_name} disabled = {false} />
                </div>
                <div className= "flex flex-col sm:flex-row justify-center-safe mb-10 mt-10">
                    <Button 
                        id = "updateClient"
                        className = "mr-5"
                        text = "Update" 
                        session={session} 
                        url="/api/clients/update" 
                        payload = {['clientid','clientname']}
                        callBack= {handleCallBack} />

                    <Button 
                        id = "delClient"
                        className = "danger"
                        text = "Delete" 
                        session={session} 
                        url="/api/clients/delete" 
                        payload = {['clientid']}
                        callBack= {handleCallBack} />
                    <button className="sm:ml-5" type="reset">Reset</button>
                </div>

                {errorEvent && <div className = "error">{errorEvent}</div>}
                {successEvent && <div className = "success">{successEvent}</div>}
            </form>
        </div>
    )
}