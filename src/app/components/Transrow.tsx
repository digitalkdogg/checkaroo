'use client'
import { convertToNiceDate, formatDouble } from "@/common/common" 
import Link from 'next/link'

interface Props {
    transId: string,
    date: string,
    companyName: string,
    amount:number,
    categoryName: string
}

export default function Transrow(trans:Props) {
    return (

            <Link href = {{pathname : 'trans/dets', query: {id : trans.transId}}} 
             className = "flex p-4 shadow-sm shadow-stone-400 no-scale-hover">
                <div className = "flex-1">{convertToNiceDate(trans.date)}</div>
                <div className = "flex-1">{trans.companyName}</div>
                <div className = "flex-1">${formatDouble(trans.amount)}</div>
                <div className = "flex-1">{trans.categoryName}</div>
            </Link>


    )

}