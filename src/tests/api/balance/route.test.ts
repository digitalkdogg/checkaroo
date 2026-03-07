import { POST } from '@/app/api/balance/route';
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

describe('POST /api/balance', () => {
  it('should return 401 if headers are not legit', async () => {
    (headersLegit as jest.Mock).mockReturnValue(false);
    const req = new NextRequest('http://localhost/api/balance', { method: 'POST' });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it('should return 401 if session is missing', async () => {
    (headersLegit as jest.Mock).mockReturnValue(true);
    const req = new NextRequest('http://localhost/api/balance', {
      method: 'POST',
      body: JSON.stringify({}),
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it('should return 401 if accountid is not found', async () => {
    (headersLegit as jest.Mock).mockReturnValue(true);
    (getAccountIDSession as jest.Mock).mockResolvedValue(null);
    const req = new NextRequest('http://localhost/api/balance', {
      method: 'POST',
      body: JSON.stringify({ session: 'valid-session' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it('should return balance if everything is valid', async () => {
    (headersLegit as jest.Mock).mockReturnValue(true);
    (getAccountIDSession as jest.Mock).mockResolvedValue('acc123');
    (select as jest.Mock).mockResolvedValue([{ balance: 100.00 }]);
    
    const req = new NextRequest('http://localhost/api/balance', {
      method: 'POST',
      body: JSON.stringify({ session: 'valid-session' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toEqual([{ balance: 100.00 }]);
  });
});
