import { checkValidSession, findSession, getAccountIDSession, headersLegit } from '@/common/session'
import { select } from '@/common/dbutils'
import { decrypt } from '@/common/crypt'
import moment from 'moment'
import { NextRequest } from 'next/server'

jest.mock('@/common/dbutils', () => ({
  select: jest.fn(),
  update: jest.fn(),
}))

jest.mock('@/common/crypt', () => ({
  decrypt: jest.fn(),
}))

jest.mock('@/common/logs', () => ({
  writelog: jest.fn(),
}))

describe('session helpers', () => {
  test('checkValidSession - invalid length', async () => {
    const result = await checkValidSession('short')
    expect(result).toBe(false)
  })

  test('checkValidSession - valid session', async () => {
    const session = 'a'.repeat(90);
    const futureDate = moment().add(1, 'hour').format('YYYY-MM-DD HH:mm:ss');
    (select as jest.Mock).mockResolvedValue([{ ExpireDT: futureDate }]);
    
    const result = await checkValidSession(session)
    expect(result).toBe(true)
  })

  test('findSession', () => {
    const sessionstr = '1234|||some-session-hash|||5678'
    expect(findSession(sessionstr)).toBe('some-session-hash')
    expect(findSession('no-triple-pipe')).toBe(null)
  })

  test('getAccountIDSession', async () => {
    const longSessionHash = 'a'.repeat(90) + '-' + 'b'.repeat(10);
    const session = 'encrypted-session';
    (decrypt as jest.Mock).mockReturnValue(`1234|||${longSessionHash}|||5678`);
    
    const mockSelect = select as jest.Mock;
    mockSelect.mockClear();
    mockSelect.mockResolvedValueOnce([{ ExpireDT: moment().add(1, 'hour').format('YYYY-MM-DD HH:mm:ss') }]); // for checkValidSession
    mockSelect.mockResolvedValueOnce([{ account_id: 'acc123' }]); // for account query
    
    const result = await getAccountIDSession(session);
    expect(result).toBe('acc123');
  })

  test('headersLegit', () => {
    const mockRequest = {
      headers: {
        get: jest.fn((name) => {
          if (name === 'referer') return 'http://localhost/test'
          if (name === 'content-type') return 'application/json'
          if (name === 'larva') return 'encrypted-checkaroo'
          return null
        })
      }
    } as unknown as NextRequest;

    (decrypt as jest.Mock).mockReturnValue('checkaroo');
    
    expect(headersLegit(mockRequest, ['/test'])).toBe(true)
  })
})
