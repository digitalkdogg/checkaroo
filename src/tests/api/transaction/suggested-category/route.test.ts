import { GET, POST } from '@/app/api/transaction/suggested-category/route';
import { NextRequest } from 'next/server';
import { select } from '@/common/dbutils';
import { getAccountIDSession, headersLegit } from '@/common/session';
import { decrypt } from '@/common/crypt';
import { writelog } from '@/common/logs';

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

describe('GET /api/transaction/suggested-category', () => {
  it('should return 401 Unauthorized request', async () => {
    const req = new NextRequest('http://localhost:3000/api/transaction/suggested-category', {
      method: 'GET',
    });
    const res = await GET(req);
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toBe('Unauthorized request');
  });
});

describe('POST /api/transaction/suggested-category', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 401 if headers are not legit', async () => {
    (headersLegit as jest.Mock).mockReturnValue(false);
    const req = new NextRequest('http://localhost:3000/api/transaction/suggested-category', {
      method: 'POST',
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toBe('Unauthorized request');
  });

  it('should return 401 if session is missing', async () => {
    (headersLegit as jest.Mock).mockReturnValue(true);
    const req = new NextRequest('http://localhost:3000/api/transaction/suggested-category', {
      method: 'POST',
      body: JSON.stringify({}),
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toBe('Unauthorized Session');
  });

  it('should return 401 if accountid is missing', async () => {
    (headersLegit as jest.Mock).mockReturnValue(true);
    (getAccountIDSession as jest.Mock).mockResolvedValue(null);
    const req = new NextRequest('http://localhost:3000/api/transaction/suggested-category', {
      method: 'POST',

      body: JSON.stringify({ session: 'invalid-session' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toBe('Unauthorized Account');
  });

  it('should return 400 if data is undefined after decryption', async () => {
    (headersLegit as jest.Mock).mockReturnValue(true);
    (getAccountIDSession as jest.Mock).mockResolvedValue('acc123');
    (decrypt as jest.Mock).mockReturnValue('undefined');
    const req = new NextRequest('http://localhost:3000/api/transaction/suggested-category', {
      method: 'POST',
      body: JSON.stringify({ session: 'valid-session', data: 'some-data' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('No data provided');
  });

  it('should return 444 if company is not found in data', async () => {
    (headersLegit as jest.Mock).mockReturnValue(true);
    (getAccountIDSession as jest.Mock).mockResolvedValue('acc123');
    (decrypt as jest.Mock).mockReturnValue(JSON.stringify({}));
    const req = new NextRequest('http://localhost:3000/api/transaction/suggested-category', {
      method: 'POST',
      body: JSON.stringify({ session: 'valid-session', data: 'some-data' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(444);
    const data = await res.json();
    expect(data.error.message).toBe('Company Not found');
  });

  it('should return success and category_id if found', async () => {
    (headersLegit as jest.Mock).mockReturnValue(true);
    (getAccountIDSession as jest.Mock).mockResolvedValue('acc123');
    (decrypt as jest.Mock).mockReturnValue(JSON.stringify({ company: 'comp123' }));
    (select as jest.Mock).mockResolvedValue([{ category_id: 'cat123' }]);
    const req = new NextRequest('http://localhost:3000/api/transaction/suggested-category', {
      method: 'POST',
      body: JSON.stringify({ session: 'valid-session', data: 'some-data' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.status).toBe('success');
    expect(data.category_id).toEqual([{ category_id: 'cat123' }]);
  });

  it('should return nocatfound if no category is found', async () => {
    (headersLegit as jest.Mock).mockReturnValue(true);
    (getAccountIDSession as jest.Mock).mockResolvedValue('acc123');
    (decrypt as jest.Mock).mockReturnValue(JSON.stringify({ company: 'comp123' }));
    (select as jest.Mock).mockResolvedValue(null);
    const req = new NextRequest('http://localhost:3000/api/transaction/suggested-category', {
      method: 'POST',
      body: JSON.stringify({ session: 'valid-session', data: 'some-data' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.status).toBe('nocatfound');
  });

  it('should return error status if database error occurs', async () => {
    (headersLegit as jest.Mock).mockReturnValue(true);
    (getAccountIDSession as jest.Mock).mockResolvedValue('acc123');
    (decrypt as jest.Mock).mockReturnValue(JSON.stringify({ company: 'comp123' }));
    (select as jest.Mock).mockRejectedValue(new Error('DB connection failed'));
    const req = new NextRequest('http://localhost:3000/api/transaction/suggested-category', {
      method: 'POST',
      body: JSON.stringify({ session: 'valid-session', data: 'some-data' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.status).toBe('error');
    expect(data.error).toBeDefined();
  });
});
