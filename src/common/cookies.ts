'use client'
import { getCookie, setCookie } from 'cookies-next';
import {writelog} from '@/common/logs';
import { encrypt } from '@/common/crypt';
import { get } from 'http';

export const readCookie = async (cookiename:string) => {
    const cdata = getCookie(cookiename);
    if (cdata) {
        return cdata;
    } else {
        writelog('Cookie ' + cookiename + ' not found');
    }        

    return null; 
}

export const writeCookie = async (cookiename:string, data:any, secure:any) => {
    try {
        var options:any = {}
        if (secure == true) {
            options['maxAge'] = 512
            options['secure'] = true
            
            data = encrypt(data)
        }


        setCookie(cookiename, data, options);

        const cookie = await getCookie(cookiename);

        if (cookie) {
            writelog('Cookie ' + cookiename + ' set successfully');
            return true;
        } else {
            writelog('Failed to set cookie ' + cookiename);
            return false;
        }

    } catch (error) {
        writelog('Error writing cookie ' + cookiename + ': ' + error);
        return false;
    }
}

export const deleteCookie = async (cookiename:string) => {
    try {
        setCookie(cookiename, '', { maxAge: -1 });
        const cookie = await getCookie(cookiename);
        if (cookie) {
            writelog('Failed to delete cookie ' + cookiename);
            return false;
        } else {
            writelog('Cookie ' + cookiename + ' deleted successfully');
            return true;
        }
    } catch (error) {
        writelog('Error deleting cookie ' + cookiename + ': ' + error);
    }
}