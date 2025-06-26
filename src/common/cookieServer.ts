'use server';

import {cookies} from 'next/headers'

interface CookieData {
    secure?: boolean;
    maxAge?: number;
}
export const writeCookie = async (cookiename:string, data:any, options?:CookieData) => {

   (await cookies()).set(cookiename, data, {
        secure: options?.secure || false,
        maxAge: options?.maxAge || 25200 // Default to 7 hours if
   })

}

export const readCookie = async (cookiename:string) => {
  const cookieStore = cookies()
  const cookie = (await cookieStore).get(cookiename)

  if (cookie) {
    return cookie.value
  } else {
    return null
  }
}

export const deleteCookie = async (cookiename:string) => {
  (await cookies()).set(cookiename, '', { maxAge: -1 });
  const cookieStore = cookies()
  const cookie = (await cookieStore).get(cookiename)

  if (cookie) {
    return false
  } else {
    return true
  }
}
