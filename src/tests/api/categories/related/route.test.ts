import { POST } from '@/app/api/categories/related/route';
import { NextRequest } from 'next/server';
import { select } from '@/common/dbutils';
import { getAccountIDSession, headersLegit } from '@/common/session';
import { decrypt } from '@/common/crypt';

jest.mock('@/common/dbutils', () => ({
  select: jest.fn(),
}));

jest.mock('@/common/session', () => ({
  getAccountIDSession: jest.fn(),
  headersLegit: jest.fn(),
}));

jest.mock('@/common/crypt', () => ({
  decrypt: jest.fn(),
}));

jest.mock('@/common/logs', () => ({
  writelog: jest.fn(),
}));

describe('POST /api/categories/related', () => {
  it('should return 401 if headers are not legit', async () => {
    (headersLegit as jest.Mock).mockReturnValue(false);
    const req = new NextRequest('http://localhost/api/categories/related', { method: 'POST' });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it('should return related transactions if session and id are valid', async () => {
    (headersLegit as jest.Mock).mockReturnValue(true);
    (getAccountIDSession as jest.Mock).mockResolvedValue('acc123');
    (decrypt as jest.Mock).mockReturnValue('cat1');
    const mockResults = [{ id: 1, amount: 10.00 }];
    (select as jest.Mock).mockResolvedValue(mockResults);
    
    const req = new NextRequest('http://localhost/api/categories/related', {
      method: 'POST',
      body: JSON.stringify({ session: 'valid-session', id: 'encrypted-id' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toEqual(mockResults);
  });
});
