'use client'
import { useState, useEffect, ReactHTMLElement } from 'react';
import Input from '@/app/components/Input';
import { superEcnrypt, encrypt } from '@/common/crypt';
import Error  from '@/app/components/Error';
import Loading from '@/app/components/Loading'
import { useRouter } from 'next/navigation';

interface Props {
    catid : string,
    session: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface Cat {
    account_id : number,
    category_id: string,
    category_name: string
}

interface Err {
    message: string
}

export default function Dets({ catid, session }: Props) {
    const [data, setData] = useState<any>()
    const [isLoading, setIsLoading] = useState(true);
    const [errorClient, setErrorClient] = useState<Err>();

    const [saveDataRes, setSaveDataRes] = useState<boolean|null>();
    const [isSaveLoading, setIsSaveLoading] = useState(false)
    const [errorSaveCat, setErrorSaveCat] = useState<string|null>();

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

    const saveData = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget);
        const catname = formData.get('catname');
        const data = JSON.stringify({catid: catid, catname: catname})

        setIsSaveLoading(true);
        setErrorSaveCat(null)
        setSaveDataRes(null)
        const response = await fetch('/api/categories/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                session: superEcnrypt(session),
                data: encrypt(data)
            })
        })

        if (!response.ok) {
            if (response.status == 444) {
                const json = await response.json();
                setErrorSaveCat(json.message);
            }
        } else {
            const json = await response.json();
            if (json.status) {
                setSaveDataRes(json.message)
                setTimeout(() => {
                    router.push('/categories')
                },1000)
            }
        }
        setIsSaveLoading(false)
    }   

    const deleteCat = async () => {
       const response = await fetch('/api/categories/delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                session: superEcnrypt(session),
                id: encrypt(catid)
            })
        })

        if (!response.ok) {
            const json = await response.json();
            setErrorSaveCat(json.message)
        } else {
            const json = await response.json();
            if (json.status == 'success') {
                setSaveDataRes(json.message)
                setTimeout(()=> {
                    router.push('/categories')
                },1000)
            } else {
                setErrorSaveCat(json.message);
            }
        }
    }

    useEffect(() => {
        fetchCats();
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

    return (
        <div>
            <form id = "catForm" onSubmit={saveData} className = "flex-3 bg-white flex flex-col my-50 max-w-130 justify-left" >
                <div className = "flex flex-col md:flex-row py-5">
                    <span className = "md:basis-32">CatID :</span>
                        <Input name = "catid" id = "catid" val = {data.category_id} disabled = {true} />
                </div>
                <div className = "flex flex-col md:flex-row py-5">
                    <span className = "md:basis-32">Category Name :</span>
                        <Input name = "catname" id = "catname" val = {data.category_name} disabled = {false} />
                </div>
                <div className= "flex flex-col sm:flex-row justify-center-safe mb-10 mt-10">
                    <button className="inset-shadow-indigo-500 sm:mr-5" type="submit">
                        {isSaveLoading && <span className = "inline-flex relative top-1 -left-2" id = "loadingspan"><Loading size={6} /></span>}
                        Update
                    </button>
                    <button type = "button" className="sm:ml-0 btn" onClick={deleteCat}>Delete</button>
                    <button className="sm:ml-5" type="reset">Reset</button>
                </div>
                {errorSaveCat && <div className = "error">{errorSaveCat}</div>}
                {saveDataRes && <div className = "success">{saveDataRes}</div>}
            </form>
        </div>
    )
}