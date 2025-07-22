'use client'
import { useState, useEffect } from 'react';
import Input from '@/app/components/Input';
import { superEcnrypt, encrypt } from '@/common/crypt';
import Error  from '@/app/components/Error';
import Loading from '@/app/components/Loading'
import { useRouter } from 'next/navigation';
import Button from '@/app/components/Button'
import Relateditems from '@/app/components/RelatedItems'

interface Props {
    catid : string,
    session: string
}

interface Cat {
    account_id : number,
    category_id: string,
    category_name: string
}

interface Err {
    message: string
}

interface Callback {
    msg: string
    status: string
}

export default function Dets({ catid, session }: Props) {
    const [data, setData] = useState<Cat>()
    const [isLoading, setIsLoading] = useState(true);
    const [errorClient, setErrorClient] = useState<Err>();
    const [errorEvent, setErrorEvent] = useState<string>();
    const [successEvent, setSuccessEvent] = useState<string>();

    const router = useRouter();

    const encryptedSession = superEcnrypt(session);
    const encryptedId = encrypt(catid);

    const fetchCats = async () => {
        try {
            const res = await fetch('/api/categories/id', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ session: encryptedSession, id: encryptedId }),
            });

            const json = await res.json();

            if (!res.ok || json.error) {
                setErrorClient({message: json.error || 'Error fetching category'});
            } else {
                setData(json);
            }
        } catch (err) {
             setErrorClient({ message: (err as Error).message });
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleCallBack = (callbackdata: Callback) => {
        setErrorEvent('')
        setSuccessEvent('')
        if (callbackdata.status == 'error'){
            setErrorEvent(callbackdata.msg);
        } else if (callbackdata.status == 'success') {
            setSuccessEvent(callbackdata.msg)
            setTimeout(() => {
                router.push('/categories')
            },1000)
        } else {
            setErrorEvent('There was an unknown error that occured')
        }
    }

    const handleResetCallBack = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const catname = document.getElementById('catname') as HTMLInputElement | null;
        if (catname) {
            catname.value = data?.category_name ?? '';
        }
    };

    useEffect(() => {
        fetchCats();
    },[]);

    if (isLoading) {
        return (
           <Loading />
        )
    }

    if (!data) {
        return
    }

    if (errorClient) {
        return (
            <div className = "flex-3 bg-white flex flex-col my-50 max-w-130 justify-center" >
                <Error value = {errorClient.message} />
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center w-full">
            <form id = "catForm"  className = "flex-3 bg-white flex flex-col my-10 max-w-130 justify-left" >
                <div className = "flex flex-col md:flex-row py-5">
                    <span className = "md:basis-32">CatID :</span>
                        <Input name = "catid" id = "catid" val = {data.category_id} disabled = {true} />
                </div>
                <div className = "flex flex-col md:flex-row py-5">
                    <span className = "md:basis-32">Category Name :</span>
                        <Input name = "catname" id = "catname" val = {data.category_name} disabled = {false} />
                </div>
                <div className= "flex flex-col sm:flex-row justify-center-safe mb-10 mt-10">
                    <Button 
                        id = "updateCat"
                        className = "mr-5"
                        text = "Update" 
                        session={session} 
                        url="/api/categories/update" 
                        payload = {['catid','catname']}
                        callBack= {handleCallBack} />

                    <Button 
                        id = "delCat"
                        className = "danger"
                        text = "Delete" 
                        session={session} 
                        url="/api/categories/delete" 
                        payload = {['catid']}
                        callBack= {handleCallBack} />
                    <button className="sm:ml-5" type="reset" onClick={handleResetCallBack}>Reset</button>
                </div>

                {errorEvent && <div className = "error">{errorEvent}</div>}
                {successEvent && <div className = "success">{successEvent}</div>}
            </form>
            <Relateditems session={session} id = {catid} api = "/api/categories/related" />
        </div>
    )
}