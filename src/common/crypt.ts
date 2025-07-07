import CryptoJS from 'crypto-js';
import {writelog} from '@/common/logs'
import moment from 'moment'

const cipherKey = process.env.NEXT_PUBLIC_APP_crypt  as string;

export const encrypt = (data:string) => {
  const encrypted = CryptoJS.AES.encrypt(data, cipherKey).toString();
  writelog('\n' +'before enc val ' + data + '::: after enc val: ' + encrypted.toString() + '\n' )
   return encodeURIComponent(encrypted);
};

export const decrypt = (encryptedData:string) => {
 const decoded = decodeURIComponent(encryptedData);
  const bytes = CryptoJS.AES.decrypt(decoded, cipherKey);
  writelog('\n' +'after decrypt val now: ' + bytes.toString(CryptoJS.enc.Utf8) + '\n')
  return bytes.toString(CryptoJS.enc.Utf8);
};

export const superEcnrypt = (session:string) => {
  const decrypted = decrypt(session);
  return encrypt(moment().format('SSSS') + '|||' + decrypted + '|||' + moment().format('SSSS'));
};
