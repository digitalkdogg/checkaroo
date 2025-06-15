import { convertToNiceDate, formatDouble } from "@/common/common" 
import {encrypt} from '@/common/crypt'

interface Props {
    transId: string,
    date: string,
    companyName: string,
    amount:number,
    categoryName: string
}

export default function Page(trans:Props) {
    return (
       <a href = {'/trans/dets?id=' + encrypt(trans.transId)} key = {encrypt(trans.transId)} 
            className = "flex p-4 shadow-sm shadow-stone-400 ">
            <div className = "flex-1">{convertToNiceDate(trans.date)}</div>
            <div className = "flex-1">{trans.companyName}</div>
            <div className = "flex-1">${formatDouble(trans.amount)}</div>
            <div className = "flex-1">{trans.categoryName}</div>
        </a>

    )

}