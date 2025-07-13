'use client'

import { useState, useEffect } from 'react';
import { superEcnrypt } from '@/common/crypt';
import Error from '@/app/components/Error';
import Link from 'next/link';

import '@/app/globals.css'

interface Props {
    session: string
}

interface Category {
    account_id : number,
    category_id : number,
    category_name: string
}


export default function page(props: Props) {
    const [data, setData] = useState<Category[]>([])
    const [errorCat, setErrorCat] = useState<string>();

    const getCategory = async() => {
    

        const response = await fetch('/api/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
            session: superEcnrypt(props.session)
            })
        })

        if (!response.ok) {
            setErrorCat('Error getting category info')
        } else {
            const json = await response.json();
            if (json) {
                if (json.err) {
                    setErrorCat(json.err.message)
                }
                setData(json);
            }
        }
    }

    useEffect(() => {
        getCategory()
    }, []);

    if (errorCat) {
        return (
            <Error value = {errorCat} />
        )
    }

    return (
        <div>
            <div className = "bg-gray-200 h-dvh overflow-y-scroll">
                <div className = "header flex py-2 px-4 shadow-md shadow-lg shadow-green-light/30 bg-white text-black">
                    <div className="flex-1 font-bold text-green indent-5">CategoryID</div>
                    <div className="flex-1 font-bold text-green indent-10">Category Name</div>
                </div>
                {data.map(category => (
                    <Link  key={category.category_id} className="flex p-4 shadow-sm shadow-stone-400 no-scale-hover"
                        href = {{pathname : '/categories/dets', query: {id : category.category_id}}}>
                        <div className = "flex-1 font-bold text-green indent-5">{category.category_id}</div>
                        <div className="flex-1 font-bold text-green indent-10">{category.category_name}</div>
                    </Link>
                ))}   
            </div>
        </div>
    )
}