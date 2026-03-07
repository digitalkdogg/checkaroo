import { POST } from '@/app/api/transaction/route';
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

describe('POST /api/transaction', () => {
  it('should return transaction by id if session and id are valid', async () => {
    (headersLegit as jest.Mock).mockReturnValue(true);
    (getAccountIDSession as jest.Mock).mockResolvedValue('acc123');
    (decrypt as jest.Mock).mockReturnValue('trans1');
    const mockTrans = { transid: 'trans1', amount: 100.00 };
    (select as jest.Mock).mockResolvedValue([mockTrans]);
    
    const req = new NextRequest('http://localhost/api/transaction', {
      method: 'POST',
      body: JSON.stringify({ session: 'valid-session', transid: 'encrypted-id' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toEqual(mockTrans);
  });
});
