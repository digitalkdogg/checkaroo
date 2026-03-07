import { POST } from '@/app/api/balance/update/route';
import { NextRequest } from 'next/server';
import { select, update } from '@/common/dbutils';
import { getAccountIDSession, headersLegit } from '@/common/session';

jest.mock('@/common/dbutils', () => ({
  select: jest.fn(),
  update: jest.fn(),
}));

jest.mock('@/common/session', () => ({
  getAccountIDSession: jest.fn(),
  headersLegit: jest.fn(),
}));

jest.mock('@/common/logs', () => ({
  writelog: jest.fn(),
}));

describe('POST /api/balance/update', () => {
  it('should return 401 if headers are not legit', async () => {
    (headersLegit as jest.Mock).mockReturnValue(false);
    const req = new NextRequest('http://localhost/api/balance/update', { method: 'POST' });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it('should return 401 if session is missing', async () => {
    (headersLegit as jest.Mock).mockReturnValue(true);
    const req = new NextRequest('http://localhost/api/balance/update', {
      method: 'POST',
      body: JSON.stringify({}),
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it('should return 400 if data is missing', async () => {
    (headersLegit as jest.Mock).mockReturnValue(true);
    (getAccountIDSession as jest.Mock).mockResolvedValue('acc123');
    const req = new NextRequest('http://localhost/api/balance/update', {
      method: 'POST',
      body: JSON.stringify({ session: 'valid-session' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('should update balance and return success', async () => {
    (headersLegit as jest.Mock).mockReturnValue(true);
    (getAccountIDSession as jest.Mock).mockResolvedValue('acc123');
    (select as jest.Mock).mockResolvedValue([{ balance: 100.00 }]);
    (update as jest.Mock).mockResolvedValue({ affectedRows: 1 });
    
    const req = new NextRequest('http://localhost/api/balance/update', {
      method: 'POST',
      body: JSON.stringify({
        session: 'valid-session',
        data: JSON.stringify({ value: '10.00' })
      }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.status).toBe('success');
    expect(data.newbalance).toBe(90.00);
  });
});
