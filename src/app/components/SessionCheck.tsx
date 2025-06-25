'use server'
import { readCookie } from "@/common/cookieServer";
import {checkValidSession} from '@/common/session'

interface Props {
  //  enable: boolean,
   // link: string,
   // text:string
}

export default async function Page() {

    const cookiename:any = process.env.NEXT_PUBLIC_cookiestr
    var sessionCookie = await readCookie(cookiename); 
    if (await readCookie(cookiename )) {
        if (await checkValidSession(sessionCookie) != true) {
            return false;
        }
    } else {
        return false;
    }

    return true;
}