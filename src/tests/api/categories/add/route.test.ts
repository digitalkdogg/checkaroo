import { POST } from '@/app/api/categories/add/route';
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

describe('POST /api/categories/add', () => {
  it('should return 401 if headers are not legit', async () => {
    (headersLegit as jest.Mock).mockReturnValue(false);
    const req = new NextRequest('http://localhost/api/categories/add', { method: 'POST' });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it('should add category if session and data are valid', async () => {
    (headersLegit as jest.Mock).mockReturnValue(true);
    (getAccountIDSession as jest.Mock).mockResolvedValue('acc123');
    (decrypt as jest.Mock).mockReturnValue(JSON.stringify({ CategoryName: 'New Category' }));
    (select as jest.Mock).mockResolvedValueOnce([]); // validateCategory before insert
    (insert as jest.Mock).mockResolvedValue({ status: 'success' });
    (select as jest.Mock).mockResolvedValueOnce([{ id: '1' }]); // validateCategory after insert
    
    const req = new NextRequest('http://localhost/api/categories/add', {
      method: 'POST',
      body: JSON.stringify({ session: 'valid-session', data: 'encrypted-data' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.status).toBe('success');
  });

  it('should return 400 if category already exists', async () => {
    (headersLegit as jest.Mock).mockReturnValue(true);
    (getAccountIDSession as jest.Mock).mockResolvedValue('acc123');
    (decrypt as jest.Mock).mockReturnValue(JSON.stringify({ CategoryName: 'Existing' }));
    (select as jest.Mock).mockResolvedValueOnce([{ id: '1' }]); // validateCategory before insert
    
    const req = new NextRequest('http://localhost/api/categories/add', {
      method: 'POST',
      body: JSON.stringify({ session: 'valid-session', data: 'encrypted-data' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('Category already exists');
  });
});
