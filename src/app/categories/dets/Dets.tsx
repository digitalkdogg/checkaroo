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
}

interface Cat {
    account_id : number,
    category_id: string,
    category_name: string
}

interface Err {
    message: string
}


export default function Dets(props:Props) {
    const [data, setData] = useState<any>()
    const [isLoading, setIsLoading] = useState(true);
    const [errorClient, setErrorClient] = useState<Err>();

    const [saveDataRes, setSaveDataRes] = useState<boolean|null>();
    const [isSaveLoading, setIsSaveLoading] = useState(false)
    const [errorSaveCat, setErrorSaveCat] = useState<string|null>();

    const router = useRouter();

    const deleteCat = async () => {
       const response = await fetch('/api/categories/delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                session: superEcnrypt(props.session),
                id: encrypt(props.catid)
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

    const saveData = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSaveLoading(true);
        setErrorSaveCat(null)
        setSaveDataRes(null)
        const formData = new FormData(e.currentTarget);
        const catid = props.catid;
        const catname = formData.get('catname');
        const data = JSON.stringify({catid: catid, catname: catname})

        const response = await fetch('/api/categories/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                session: superEcnrypt(props.session),
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

    useEffect(() => {

        const fetchCats = async() => {
            const response = await fetch('/api/categories/id', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    session: superEcnrypt(props.session),
                    id: encrypt(props.catid)
                })
            })

            if (!response.ok) {
                setErrorClient({message: 'error'})
            } else {
                const json = await response.json();
                if (json.category_id) {
                    setData(json);
                } else {
                    setErrorClient({message: json[0].error})
                }

                setTimeout(()=> {
                    console.log(data)
                },2000)
            }

            setIsLoading(false);
        };

        fetchCats();
    },[]);

    if (isLoading) {
        return (
            <div>loading</div>
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
                        <Input name = "catname" id = "catnasme" val = {data.category_name} disabled = {false} />
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