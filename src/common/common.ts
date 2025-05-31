import pool from '@/common/db'
import crypto from 'crypto';

export const formatDouble = (amount:number) => {
  return amount.toFixed(2)
}

export const convertToNiceDate = (mydate:string) => {
    let dadate = new Date(mydate);
    let datestr = ''
    let damonth = dadate.getMonth() + 1
    let damonthstr = damonth.toString()
    let daday = dadate.getDate();
    let dadaystr = daday.toString();

    if (damonth < 10) {
       damonthstr = '0' + damonth
    }

    if (daday < 10) {
      dadaystr = '0'+ daday
    }

    datestr = damonthstr  + '-' + dadaystr+ '-' + dadate.getFullYear()
    return datestr;
}

export const convertToMySQLDate = (jsdate:Date) => {
  return jsdate.getFullYear() + '-' + (jsdate.getMonth() + 1) + '-' + jsdate.getDate() + ' ' + jsdate.getHours() + ':' + jsdate.getMinutes() + ':' + jsdate.getSeconds()
}


export const checkbadsqlstr = (str:string) => {
  const keywords = ['select', 'update', 'insert', 'delete'];
  const keywords2 = ['from', 'into', 'set']

    for (let x=0; x<keywords.length; x++) {
      if (str.indexOf(keywords[x])>=0) {
        for (let y=0; y<keywords2.length; y++) {
          if (str.indexOf(keywords2[y])>0) {
            return true;
          }
        }
      }
    }

    return false;
} 

export const getDataFromCookie = (cookiestr:any) => {
    if (checkbadsqlstr(cookiestr)==true) {
      return '';
    }

    var fieldnames = cookiestr.split('||')
    var fieldvals = []
    var returnobj:any = {}
    if (fieldnames != undefined) {
      for (let x =0; x<fieldnames.length; x++) {
        fieldvals = fieldnames[x].split(':')
        var indi = fieldvals[0]
        returnobj[indi] = fieldvals[1]
      }
    }

    return returnobj
}