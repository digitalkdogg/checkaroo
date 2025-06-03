import {select} from '@/common/dbutils'
import moment from 'moment'
import { NextResponse } from 'next/server'

export const formatDouble = (amount:number) => {
  return amount.toFixed(2)
}

export const convertToMySQLDate = (jsdate:Date) => {
    return moment(jsdate).format('Y-MM-DD HH:mm:ss')
}

export const convertToNiceDate = (mydate:string) => {
    return moment(mydate).format('MM-DD-YYYY')
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

export const checkValidSession = async (session:any) => {
    const query = {
          select: '*',
          from: 'Logins',
          where: 'Logins.session_hash = "' + session + '"',
          sort: 'Logins.loginDT desc',
          limit: 1
      }
    
    var isValid = false;
    
    var rowsarr:any = []
    const rows = await select(query);
    rowsarr = rows;
    for (let x =0; x<rowsarr.length; x++) {
      var expireDT = moment(rowsarr[x].ExpireDT)
      var now = moment()
      if (expireDT > now) {
        isValid = true;
      }
    }

    return  isValid;
}

export const checkActiveSession = async (username:any) => {
      const query = {
          select: '*',
          from: 'User',
          where: 'User.user_id = "' + username + '"',
          join: ['inner join Logins on Logins.user_id = User.user_id'],
          sort: 'Logins.loginDT desc',
          limit: 1
      }

      var isActive = false;

      var rowsarr:any = []
      const rows = await select(query);
      rowsarr = rows;

      if (rowsarr.length == 1) {
        for(let x=0; x<rowsarr.length; x++) {
            if (rowsarr[x].ExpireDT) {
              let expireDT = moment(rowsarr[x].ExpireDT) 
              let now = moment()
              if (expireDT < now.add(12, 'hours') ) {
                isActive = true;
              }
            }
        }
      }
  return isActive
}

export const setExpireDT = () => {
  let now = moment()
  return now.add(12, 'hours')
}