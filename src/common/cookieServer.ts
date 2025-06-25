'use server';

import {cookies} from 'next/headers'

export const writeCookie = async (cookiename:string, data:any, secure:any) => {
  (await cookies()).set(cookiename, data, {
                    secure:true,
                    // sameSite: true,
                    maxAge: 25200
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
