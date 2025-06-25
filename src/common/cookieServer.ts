'use server';

import {cookies} from 'next/headers'

export const writeCookie2 = async (cookiename:string, data:any, secure:any) => {
  (await cookies()).set(cookiename, data, {
                    secure:true,
                    // sameSite: true,
                    maxAge: 25200
                })


}