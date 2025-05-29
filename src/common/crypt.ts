import CryptoJS from 'crypto-js';

//npm install crypto-js --save
//npm install @types/crypto-js

const cipherKey = 'dadalkjfasdlkfjasdaladflj' //process.env.NEXT_PUBLIC_CIPHER_KEY;

export const encrypt = (data:any) => {
  const encrypted = CryptoJS.AES.encrypt(data, cipherKey).toString();
  return encodeURIComponent(encrypted);
};

export const decrypt = (encryptedData:any) => {
  const decoded = decodeURIComponent(encryptedData);
  const bytes = CryptoJS.AES.decrypt(decoded, cipherKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};