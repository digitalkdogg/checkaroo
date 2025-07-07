'use server';

import {cookies} from 'next/headers'
import {writelog} from '@/common/logs'

interface CookieData {
    secure?: boolean;
    maxAge?: number;
}
export const writeCookie = async (cookiename:string, data:string, options?:CookieData) => {
   (await cookies()).set(cookiename, data, {
        secure: options?.secure || false,
        maxAge: options?.maxAge || 25200 // Default to 7 hours if
   })
   return
}

export const readCookie = async (cookiename:string) => {
    const cookieStore = cookies()
    try {
      const cookie = (await cookieStore).get(cookiename)
      if (cookie) {
        return cookie.value
      } else {
        return null
      }
    } catch(e) {
      if (e) {
        writelog('Error reading cookie ' + cookiename + ' : ' + e.toString());
      }
     return null;
    }
  

}

export const deleteCookie = async (cookiename:string) => {
  (await cookies()).set(cookiename, '', { maxAge: -1 });
    const cookieStore = cookies()
    try {

      const cookie = (await cookieStore).get(cookiename)

      if (cookie) {
        return false
      } else {
        return true
      }
    } catch(e) {
      if(e) {
        writelog('Error deleting cookie ' + cookiename);
      }
      return false;
    }
}
