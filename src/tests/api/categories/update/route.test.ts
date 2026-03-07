import { POST } from '@/app/api/categories/update/route';
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

describe('POST /api/categories/update', () => {
  it('should return 401 if headers are not legit', async () => {
    (headersLegit as jest.Mock).mockReturnValue(false);
    const req = new NextRequest('http://localhost/api/categories/update', { method: 'POST' });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it('should update category if session and data are valid', async () => {
    (headersLegit as jest.Mock).mockReturnValue(true);
    (getAccountIDSession as jest.Mock).mockResolvedValue('acc123');
    (decrypt as jest.Mock).mockReturnValue(JSON.stringify({ catname: 'Updated Category', catid: 'cat1' }));
    (select as jest.Mock).mockResolvedValue([]); // No existing category with same name
    (update as jest.Mock).mockResolvedValue({ affectedRows: 1 });
    
    const req = new NextRequest('http://localhost/api/categories/update', {
      method: 'POST',
      body: JSON.stringify({ session: 'valid-session', data: 'encrypted-data' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.status).toBe('success');
  });

  it('should return error if category name already exists for another id', async () => {
    (headersLegit as jest.Mock).mockReturnValue(true);
    (getAccountIDSession as jest.Mock).mockResolvedValue('acc123');
    (decrypt as jest.Mock).mockReturnValue(JSON.stringify({ catname: 'Existing', catid: 'cat1' }));
    (select as jest.Mock).mockResolvedValue([{ category_id: 'cat2', category_name: 'Existing' }]);
    
    const req = new NextRequest('http://localhost/api/categories/update', {
      method: 'POST',
      body: JSON.stringify({ session: 'valid-session', data: 'encrypted-data' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(444);
    const data = await res.json();
    expect(data.message).toBe('Category already exists');
  });
});
