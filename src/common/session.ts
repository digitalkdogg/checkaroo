import moment from 'moment'
import {select, update} from '@/common/dbutils'
import { NextResponse, NextRequest } from 'next/server'
import { writelog } from '@/common/logs'
import {decrypt} from '@/common/crypt'


interface LoginRow {
  ExpireDT: string;
  account_id: string;
  session_hash: string
}

export const checkValidSession = async (session: string): Promise<boolean> => {

  if (session.length < 89) {
    return false;
  }

  const keywords = ['select', 'update', 'insert', 'delete', 'testing', 'password'];
  for (let x = 0; x < keywords.length; x++) {
    if (session.includes(keywords[x])) {
      return false;
    }
  }

  const query = {
    select: '*',
    from: 'Logins',
    where: 'Logins.session_hash = "' + session + '"',
    sort: 'Logins.loginDT desc',
    limit: 1,
  };

  const rows = await select(query) as LoginRow[];

  for (const row of rows) {
    const expireDT = moment(row.ExpireDT);
    const now = moment();
    if (expireDT > now) {
      writelog(`session for ${session} is true`);
      return true;
    }
  }

  writelog(`session for ${session} is false`);
  return false;
};

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

      const rows = await select(query) as LoginRow[];


      if (rows.length == 1) {
        const account = rows[0].account_id
        return account;
      }

      return null;
      
  }
}

export const checkUserForActiveSession = async (user:string)=> {

   const sessionQuery = {
        select: '*',
        from : 'Logins',
        where : 'Logins.user_id = "' + user + '"' ,
        sort: 'LoginDT desc',
        limit : 10,
    }

    const sessions = await select(sessionQuery) as LoginRow[];

    if (sessions.length>0) {
      for (let x =0; x< sessions.length; x++) {
        const expireDT = moment(sessions[x].ExpireDT);
        const now = moment();
        if (expireDT > now) {
          return sessions[x].session_hash;
        }
      }
    } else {
      return false;
    }
  return false
}

export const doesSessionExists = async (session:string, user:string) => {
   const sessionQuery = {
        select: '*',
        from : 'Logins',
        where : 'Logins.session_hash = "' + session + '" and user_id = "' + user + '"' 
    }

    const sessions = await select(sessionQuery) as LoginRow[];

    if (sessions.length>0) {
      for (let x =0; x<sessions.length; x++) {
        const expireDT = moment(sessions[x].ExpireDT)
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
  
      try {
          const rows = await select(query) as LoginRow[]
          if (rows.length > 0) {
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

export const headersLegit = (request:NextRequest, legitrefer:[string] | [string, string] | 
  [string, string, string] | [string, string, string, string]) => {
  const referer = request.headers.get('referer');

  let foundit = false;
  if (referer == null || referer == '') {
    return false;
  } else {
    foundit = false;
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