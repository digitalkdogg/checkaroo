import { POST } from '@/app/api/transaction/add/route';
import { NextRequest } from 'next/server';
import { select, insert } from '@/common/dbutils';
import { getAccountIDSession, headersLegit } from '@/common/session';
import { decrypt } from '@/common/crypt';

jest.mock('@/common/dbutils', () => ({
  select: jest.fn(),
  insert: jest.fn(),
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

describe('POST /api/transaction/add', () => {
  it('should add transaction if session and data are valid', async () => {
    (headersLegit as jest.Mock).mockReturnValue(true);
    (getAccountIDSession as jest.Mock).mockResolvedValue('acc123');
    (decrypt as jest.Mock).mockImplementation((val) => {
        if (val === 'encrypted-data') return JSON.stringify({ date: new Date(), clients: 'Client1', amount: '100.00', categories: 'Cat1' });
        return val;
    });
    (select as jest.Mock).mockResolvedValue([{ client_id: 1, category_id: 1 }]); // Mock getClientID, getCatID, validateTransaction
    (insert as jest.Mock).mockResolvedValue({ status: 'success' });
    
    const req = new NextRequest('http://localhost/api/transaction/add', {
      method: 'POST',
      body: JSON.stringify({ session: 'valid-session', data: 'encrypted-data' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.status).toBe('success');
  });
});
