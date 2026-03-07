import { encrypt, decrypt, superEcnrypt } from '@/common/crypt'
import moment from 'moment'

// Mock environment variable
process.env.NEXT_PUBLIC_APP_crypt = 'testkey';

describe('crypt helpers', () => {
  test('encrypt and decrypt', () => {
    const original = 'test-data';
    const encrypted = encrypt(original);
    const decrypted = decrypt(encrypted);
    expect(decrypted).toBe(original);
  })

  test('superEncrypt', () => {
    const original = 'test-session';
    const encryptedOriginal = encrypt(original);
    const superEncrypted = superEcnrypt(encryptedOriginal);
    
    const decrypted = decrypt(superEncrypted);
    // Format should be SSSS|||original|||SSSS
    expect(decrypted).toMatch(/^\d{4}\|\|\|test-session\|\|\|\d{4}$/);
  })
})
