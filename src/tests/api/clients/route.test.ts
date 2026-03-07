import { POST } from '@/app/api/clients/route';
import { NextRequest } from 'next/server';
import { select } from '@/common/dbutils';
import { getAccountIDSession, headersLegit } from '@/common/session';

jest.mock('@/common/dbutils', () => ({
  select: jest.fn(),
}));

jest.mock('@/common/session', () => ({
  getAccountIDSession: jest.fn(),
  headersLegit: jest.fn(),
}));

jest.mock('@/common/logs', () => ({
  writelog: jest.fn(),
}));

describe('POST /api/clients', () => {
  it('should return 401 if headers are not legit', async () => {
    (headersLegit as jest.Mock).mockReturnValue(false);
    const req = new NextRequest('http://localhost/api/clients', { method: 'POST' });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it('should return clients if session is valid', async () => {
    (headersLegit as jest.Mock).mockReturnValue(true);
    (getAccountIDSession as jest.Mock).mockResolvedValue('acc123');
    const mockClients = [{ client_id: 1, company_name: 'Acme Corp' }];
    (select as jest.Mock).mockResolvedValue(mockClients);
    
    const req = new NextRequest('http://localhost/api/clients', {
      method: 'POST',
      body: JSON.stringify({ session: 'valid-session' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toEqual(mockClients);
  });
});
