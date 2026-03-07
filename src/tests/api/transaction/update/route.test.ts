import { POST } from '@/app/api/transaction/update/route';
import { NextRequest } from 'next/server';
import { select, update } from '@/common/dbutils';
import { getAccountIDSession, headersLegit } from '@/common/session';
import { decrypt } from '@/common/crypt';

jest.mock('@/common/dbutils', () => ({
  select: jest.fn(),
  update: jest.fn(),
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

describe('POST /api/transaction/update', () => {
  it('should update transaction if session and data are valid', async () => {
    (headersLegit as jest.Mock).mockReturnValue(true);
    (getAccountIDSession as jest.Mock).mockResolvedValue('acc123');
    (decrypt as jest.Mock).mockReturnValue(JSON.stringify({ transid: 'trans1', date: new Date(), amount: '100.00', clients: 'Client1', categories: 'Cat1' }));
    (select as jest.Mock).mockResolvedValue([{ client_id: 1, category_id: 1 }]); // Mock getClientID, getCatID
    (update as jest.Mock).mockResolvedValue({ affectedRows: 1 });
    
    const req = new NextRequest('http://localhost/api/transaction/update', {
      method: 'POST',
      body: JSON.stringify({ session: 'valid-session', data: 'encrypted-data' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.status).toBe('success');
  });
});
