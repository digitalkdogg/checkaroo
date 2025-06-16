import CryptoJS from 'crypto-js';

const cipherKey:any = process.env.NEXT_PUBLIC_APP_crypt 

export const encrypt = (data:any) => {
  const encrypted = CryptoJS.AES.encrypt(data, cipherKey).toString();
 // process.stdout.write('\n' +'after enc val: ' + encrypted + '\n')
   return encodeURIComponent(encrypted);
};

export const decrypt = (encryptedData:any) => {
 const decoded = decodeURIComponent(encryptedData);
  const bytes = CryptoJS.AES.decrypt(decoded, cipherKey);
  process.stdout.write('\n' +'after decrypt val now: ' + bytes + '\n')

  return bytes.toString(CryptoJS.enc.Utf8);
};