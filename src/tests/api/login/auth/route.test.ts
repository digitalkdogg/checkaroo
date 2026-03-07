import { POST } from '@/app/api/login/auth/route';
import { NextRequest } from 'next/server';
import { validateUser, checkUserForActiveSession, headersLegit, findSession, doesSessionExists } from '@/common/session';
import { decrypt, encrypt } from '@/common/crypt';
import { insert } from '@/common/dbutils';
import { writeCookie, readCookie } from '@/common/cookieServer';

jest.mock('@/common/dbutils', () => ({ insert: jest.fn() }));
jest.mock('@/common/session', () => ({
  validateUser: jest.fn(),
  checkUserForActiveSession: jest.fn(),
  doesSessionExists: jest.fn(),
  headersLegit: jest.fn(),
  findSession: jest.fn(),
  expireSession: jest.fn(),
}));
jest.mock('@/common/crypt', () => ({
  decrypt: jest.fn(),
  encrypt: jest.fn(),
}));
jest.mock('@/common/cookieServer', () => ({
  writeCookie: jest.fn(),
  readCookie: jest.fn(),
}));
jest.mock('@/common/logs', () => ({ writelog: jest.fn() }));

describe('POST /api/login/auth', () => {
  it('should return success if login is valid', async () => {
    (headersLegit as jest.Mock).mockReturnValue(true);
    (decrypt as jest.Mock).mockReturnValue(JSON.stringify({ username: 'user', password: 'pass' }));
    (validateUser as jest.Mock).mockResolvedValue(true);
    (readCookie as jest.Mock).mockResolvedValue(null);
    (checkUserForActiveSession as jest.Mock).mockResolvedValue(false);
    (insert as jest.Mock).mockResolvedValue(true);
    
    const req = new NextRequest('http://localhost/api/login/auth', {
      method: 'POST',
      body: JSON.stringify({ data: 'encrypted-data' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.status).toBe('success');
  });
});
