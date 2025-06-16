import CryptoJS from 'crypto-js';
import {writelog} from '@/common/logs'

const cipherKey:any = process.env.NEXT_PUBLIC_APP_crypt 

export const encrypt = (data:any) => {
  const encrypted = CryptoJS.AES.encrypt(data, cipherKey).toString();
  writelog('\n' +'after enc val: ' + encrypted.toString() + '\n' )
   return encodeURIComponent(encrypted);
};

export const decrypt = (encryptedData:any) => {
 const decoded = decodeURIComponent(encryptedData);
  const bytes = CryptoJS.AES.decrypt(decoded, cipherKey);
  writelog('\n' +'after decrypt val now: ' + bytes.toString(CryptoJS.enc.Utf8) + '\n')
  return bytes.toString(CryptoJS.enc.Utf8);
};