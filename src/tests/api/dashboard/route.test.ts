import { POST } from '@/app/api/dashboard/route';
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

describe('POST /api/dashboard', () => {
  it('should return transactions if session is valid', async () => {
    (headersLegit as jest.Mock).mockReturnValue(true);
    (getAccountIDSession as jest.Mock).mockResolvedValue('acc123');
    const mockResults = [{ id: 1, amount: 100.00 }];
    (select as jest.Mock).mockResolvedValue(mockResults);
    
    const req = new NextRequest('http://localhost/api/dashboard', {
      method: 'POST',
      body: JSON.stringify({ session: 'valid-session' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.results).toEqual(mockResults);
  });
});
