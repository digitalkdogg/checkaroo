import moment from 'moment'
import {select, update} from '@/common/dbutils'
import { NextResponse } from 'next/server'
import { writelog } from '@/common/logs'
import {decrypt} from '@/common/crypt'
import { write } from 'fs'

export const checkValidSession = async (session:any) => {

    if (session.length < 89) {
      return false;
    }

    const keywords = ['select', 'update', 'insert', 'delete', 'testing', 'password'];
    for (let x =0; x<keywords.length; x++) {
      if (session.indexOf(keywords[x]) >= 0) {
        return false;
      }
    }

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

    writelog('session for ' + session + 'is ' + isValid.valueOf())
    return  isValid;
}

export const findSession = (sessionstr:string) => {
    if (sessionstr.indexOf('|||')>=0) {
      const split = sessionstr.split('|||')
      if (split.length >=1 ) {

        for (let x =0; x<split.length; x++) {
          if (split[x].indexOf('-') > 0) {
            return split[x] 
          }
        }
      } else {
        return null;
      }
    } else {
      return null;
    }
}

export const getAccountIDSession = async (session:string) => {
  const sessionstr = decrypt(session);
  const sessionhash = findSession(sessionstr)

  if (!sessionhash) {
    return null;
  }

  if (await checkValidSession(sessionhash)) {
        const query = {
          select: '*',
          from: 'Logins',
          where: 'Logins.session_hash = "' + sessionhash + '"',
          join : ['inner join Account on Account.user_id = Logins.user_id'],
          limit: 1
      }

      var rowsarr:any = []
      const rows = await select(query);
      rowsarr = rows;

      if (rowsarr.length == 1) {
        const account = rowsarr[0].account_id;
        return account;
      }

      return null;
      
  }
}

export const checkUserForActiveSession = async (user:any)=> {
   const sessionQuery = {
        select: '*',
        from : 'Logins',
        where : 'Logins.user_id = "' + user + '"' ,
        sort: 'LoginDT desc',
        limit : 10,
    }

    var sessionsArray:any = []
    const sessions = await select(sessionQuery);
    sessionsArray = sessions;

    var testing:any = 'init';

    if (sessionsArray.length > 0) {
      for(let x = 0; x< sessionsArray.length; x++) {
        const expireDT = moment(sessionsArray[x].ExpireDT);
        const now = moment();
        testing = expireDT + '::::' + now
        if (expireDT > now) {
          return sessionsArray[x].session_hash;
        }
      }
    } else {
      return false
    }

  return false
}

export const doesSessionExists = async (session:string, user:string) => {
   const sessionQuery = {
        select: '*',
        from : 'Logins',
        where : 'Logins.session_hash = "' + session + '" and user_id = "' + user + '"' 
    }

    var sessionsArray:any = []
    const sessions = await select(sessionQuery);
    sessionsArray = sessions;

    if (sessionsArray.length>0) {
      for (let x =0; x<sessionsArray.length; x++) {
        const expireDT = moment(sessionsArray[x].expireDT)
        const now = moment();
        if (expireDT > now) {
          writelog('session for ' + session + 'and ' + user + 'is true')
          return true;
        } else {
          return false;
        }
      }

      return false;
    } else {
      return false;
    }
}

export const validateUser = async (user:string, word:string) => {

    const query = {
        select: '*',
        from: 'User',
        where: 'user_id = "' + user + '" and password_hash = "' + word + '"' 
    }
  
      var rowsarr:any = []
      try {
          const rows = await select(query)
          rowsarr=rows
          if (rowsarr.length > 0) {
            return true;
          } else {return false;}
      } catch (err) {NextResponse.json({'error':err})}
      return false;
}

export const expireSession = async (user:string) => {
  const query = {
    table : 'Logins',
    fields : 'ExpireDT = "' + moment('1/1/2025').format('yyyy-MM-DD hh:mm:ss') + '"',
    where : 'user_id = "' + user + '"',
    sort : 'ExpireDT desc',
    limit : 10
  }
  const data = await update(query);
  return data
}

export const headersLegit = (request:any, legitrefer:any) => {
  let referer = request.headers.get('referer');

  if (referer == null || referer == '') {
    
    return false;
  } else {
    var foundit = false;
    for (let x =0; x<legitrefer.length; x++) {
      if (referer.indexOf(legitrefer[x])>=0) {
        foundit = true;
        break;  
      } 
    }
  }

  let larva = request.headers.get('larva');
  if (larva ) {
    larva = decrypt(larva)
  }  
  if (larva !== 'checkaroo') {
    if (foundit ==false) {
      return false;
    }
  }
    
  if (request.headers.get('content-type') !== 'application/json') {
    return false;
  }

  return true;
}