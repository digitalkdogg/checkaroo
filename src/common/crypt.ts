import CryptoJS from 'crypto-js';
import {writelog} from '@/common/logs'
import moment from 'moment'

const cipherKey = process.env.NEXT_PUBLIC_APP_crypt  as string;

export const encrypt = (data:string) => {
  try {
    const encrypted = CryptoJS.AES.encrypt(data, cipherKey).toString();
    return encodeURIComponent(encrypted);
  } catch {
    writelog('CRYPTO_ENCRYPT_FAILED', 'encrypt', 'error');
    throw new Error('CRYPTO_ENCRYPT_FAILED');
    return data as string;
  }
};

export const decrypt = (encryptedData:string) => {
 try {
    const decoded = decodeURIComponent(encryptedData);
    const bytes = CryptoJS.AES.decrypt(decoded, cipherKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch {
    writelog('CRYPTO_DECRYPT_FAILED', 'decrypt', 'error');
    throw new Error('CRYPTO_DECRYPT_FAILED');
    return encryptedData as string;
  }
};

export const superEcnrypt = (session:string) => {
  try {
    const decrypted = decrypt(session);
    return encrypt(moment().format('SSSS') + '|||' + decrypted + '|||' + moment().format('SSSS'));
  } catch {
      writelog('superEncrypt', 'decrypt', 'error');
      throw new Error('super_encrypt_error');
      return session as string;
  }
};
