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