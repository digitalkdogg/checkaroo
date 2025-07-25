'use client'

import { useState, useEffect } from 'react';
import { superEcnrypt } from '@/common/crypt';
import Error from '@/app/components/Error';
import Link from 'next/link';

import '@/app/globals.css'

interface Props {
    session: string
}

interface Clients {
    account_id : number,
    client_id : number,
    company_name: string
}


export default function Page(props: Props) {
    const [data, setData] = useState<Clients[]>([])
    const [errorClient, setErrorClient] = useState<string>();

    const getClient = async() => {
    

        const response = await fetch('/api/clients', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
            session: superEcnrypt(props.session)
            })
        })

        if (!response.ok) {
            setErrorClient('Error getting client info')
        } else {
            const json = await response.json();
            if (json) {
                if (json.err) {
                    setErrorClient(json.err.message)
                }
                setData(json);
            }
        }
    }

    useEffect(() => {
        getClient()
    }, []);

    if (errorClient) {
        return (
            <Error value = {errorClient} />
        )
    }

    return (
        <div>
            <div className = "bg-[var(--color-light-grey)] h-dvh overflow-y-scroll">
                <div className = "header flex py-2 px-4 shadow-md shadow-lg shadow-green-light/30 bg-white text-black">
                    <div className="flex-1 font-bold text-green indent-5">ClientID</div>
                    <div className="flex-1 font-bold text-green indent-10">Client Name</div>
                </div>
                {data.map(client => (
                    <Link  key={client.client_id} className="flex p-4 shadow-sm shadow-stone-400 no-scale-hover"
                        href = {{pathname : '/clients/dets', query: {id : client.client_id}}}>
                        <div className = "flex-1 font-bold text-green indent-5">{client.client_id}</div>
                        <div className="flex-1 font-bold text-green indent-10">{client.company_name}</div>
                    </Link>
                ))}   
            </div>
        </div>
    )
}