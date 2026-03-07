import { POST } from '@/app/api/clients/id/route';
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

describe('POST /api/clients/id', () => {
  it('should return client by id if session and id are valid', async () => {
    (headersLegit as jest.Mock).mockReturnValue(true);
    (getAccountIDSession as jest.Mock).mockResolvedValue('acc123');
    (decrypt as jest.Mock).mockReturnValue('client1');
    const mockClient = { client_id: 1, company_name: 'Acme Corp' };
    (select as jest.Mock).mockResolvedValue([mockClient]);
    
    const req = new NextRequest('http://localhost/api/clients/id', {
      method: 'POST',
      body: JSON.stringify({ session: 'valid-session', id: 'encrypted-id' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    // The code returns the whole array results, not results[0]
    expect(data).toEqual([mockClient]);
  });
});
