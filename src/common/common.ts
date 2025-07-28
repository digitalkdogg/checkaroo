import moment from 'moment'

export const formatDouble = (amount:number) => {
  try {
    return amount.toFixed(2)
  } catch (e) {
    if (e) {
      return (0.00)
    }
  }
}

export const convertToMySQLDate = (jsdate:Date) => {
    return moment(jsdate, ['MMDDY','MMMDDY','MM-DD-Y']).format('YYYY-MM-DD HH:mm:ss')
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

export const getDataFromCookie = (cookiestr:string) => {
    if (checkbadsqlstr(cookiestr)==true) {
      return '';
    }

    interface ParsedCookie {
      [key: string]: string;
    }

    const fieldnames = cookiestr.split('||')
    let fieldvals = []
    const returnobj:ParsedCookie = {}
    if (fieldnames != undefined) {
      for (let x =0; x<fieldnames.length; x++) {
        fieldvals = fieldnames[x].split(':')
        const indi = fieldvals[0]
        returnobj[indi] = fieldvals[1]
      }
    }

    return returnobj
}

export const setExpireDT = () => {
  const now = moment()
  return now.add(12, 'hours').format('Y-MM-DD HH:mm:ss')
}