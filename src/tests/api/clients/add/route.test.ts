import { POST } from '@/app/api/clients/add/route';
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

describe('POST /api/clients/add', () => {
  it('should add client if session and data are valid', async () => {
    (headersLegit as jest.Mock).mockReturnValue(true);
    (getAccountIDSession as jest.Mock).mockResolvedValue('acc123');
    (decrypt as jest.Mock).mockReturnValue(JSON.stringify({ ClientName: 'New Client' }));
    (select as jest.Mock).mockResolvedValueOnce([]); // validateClient before
    (insert as jest.Mock).mockResolvedValue({ status: 'success' });
    (select as jest.Mock).mockResolvedValueOnce([{ id: '1' }]); // validateClient after
    
    const req = new NextRequest('http://localhost/api/clients/add', {
      method: 'POST',
      body: JSON.stringify({ session: 'valid-session', data: 'encrypted-data' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.status).toBe('success');
  });
});
