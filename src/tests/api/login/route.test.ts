import { POST } from '@/app/api/login/route';
import { NextRequest } from 'next/server';
import { getAccountIDSession, headersLegit } from '@/common/session';

jest.mock('@/common/session', () => ({
  getAccountIDSession: jest.fn(),
  headersLegit: jest.fn(),
}));

jest.mock('@/common/logs', () => ({
  writelog: jest.fn(),
}));

describe('POST /api/login', () => {
  it('should return valid true if session is valid', async () => {
    (headersLegit as jest.Mock).mockReturnValue(true);
    (getAccountIDSession as jest.Mock).mockResolvedValue('acc123');
    
    const req = new NextRequest('http://localhost/api/login', {
      method: 'POST',
      body: JSON.stringify({ session: 'valid-session' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.valid).toBe(true);
  });
});
