'use client'
import { useState, useEffect } from 'react';
import Input from '@/app/components/Input';
import {convertToNiceDate, formatDouble} from '@/common/common'

interface Props {
    transid : string;
}

export default function Dets(props:Props) {

    const [data, setData] = useState<any>([])
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<any>(null);

    useEffect(() => {

        const fetchData = async () => {
            try {
                const response = await fetch('/api/transaction?transid=' + props.transid); // Replace with your API endpoint
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const result = await response.json();
                setData(result)
            } catch (err) {
                setError(err);
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

    if (error) {
        return (
         <div className = "flex-3 bg-white flex px-20 flex-col my-50 items-center">Error: {error.message}</div>
        );
    }

    return (
        <div >
            <div className = "flex-3 bg-white flex px-20 flex-col my-50 max-w-3/4" >
                <div className = "flex flex-row justify-between py-5">
                    <span>TransID :</span>
                     <Input id = "transid" val = {data.trans_id} disabled = {true} />
                </div>

                <div className = "flex flex-row justify-between py-5">
                    <span>Date :</span>
                     <Input id = "date" val = {convertToNiceDate(data.date)} disabled = {false} />
                </div>
                <div className = "flex flex-row justify-between py-5">
                    <span>Amount :</span>
                     <Input id = "amount" val = {formatDouble(data.amount)} disabled = {false} />
                </div>
               
            </div>
        </div>
    );
}