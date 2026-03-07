import { POST } from '@/app/api/categories/delete/route';
import { NextRequest } from 'next/server';
import { select, deleteRec } from '@/common/dbutils';
import { getAccountIDSession, headersLegit } from '@/common/session';
import { decrypt } from '@/common/crypt';

jest.mock('@/common/dbutils', () => ({
  select: jest.fn(),
  deleteRec: jest.fn(),
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

describe('POST /api/categories/delete', () => {
  it('should return 401 if headers are not legit', async () => {
    (headersLegit as jest.Mock).mockReturnValue(false);
    const req = new NextRequest('http://localhost/api/categories/delete', { method: 'POST' });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it('should delete category if no transactions are tied to it', async () => {
    (headersLegit as jest.Mock).mockReturnValue(true);
    (getAccountIDSession as jest.Mock).mockResolvedValue('acc123');
    (decrypt as jest.Mock).mockReturnValue(JSON.stringify({ catid: 'cat1' }));
    (select as jest.Mock).mockResolvedValue([]); // No transactions
    (deleteRec as jest.Mock).mockResolvedValue(true);
    
    const req = new NextRequest('http://localhost/api/categories/delete', {
      method: 'POST',
      body: JSON.stringify({ session: 'valid-session', data: 'encrypted-data' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.status).toBe('success');
  });

  it('should not delete category if transactions are tied to it', async () => {
    (headersLegit as jest.Mock).mockReturnValue(true);
    (getAccountIDSession as jest.Mock).mockResolvedValue('acc123');
    (decrypt as jest.Mock).mockReturnValue(JSON.stringify({ catid: 'cat1' }));
    (select as jest.Mock).mockResolvedValue([{ id: 'trans1' }]); // Has transactions
    
    const req = new NextRequest('http://localhost/api/categories/delete', {
      method: 'POST',
      body: JSON.stringify({ session: 'valid-session', data: 'encrypted-data' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.status).toBe('error');
    expect(data.message).toContain('Category is tied to one or more transactions');
  });
});
