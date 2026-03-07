import { writeCookie, readCookie, deleteCookie } from '@/common/cookieServer'
import { cookies } from 'next/headers'

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}))

describe('cookieServer', () => {
  let mockCookieStore: any;

  beforeEach(() => {
    mockCookieStore = {
      set: jest.fn(),
      get: jest.fn(),
    };
    (cookies as jest.Mock).mockResolvedValue(mockCookieStore)
  })

  test('writeCookie', async () => {
    await writeCookie('test', 'data')
    expect(mockCookieStore.set).toHaveBeenCalledWith('test', 'data', expect.any(Object))
  })

  test('readCookie', async () => {
    mockCookieStore.get.mockReturnValue({ value: 'some-value' })
    const value = await readCookie('test')
    expect(value).toBe('some-value')
  })

  test('deleteCookie', async () => {
    // To make result be true, get must return null 
    mockCookieStore.get.mockReturnValue(null)
    const result = await deleteCookie('test')
    expect(result).toBe(true)
    expect(mockCookieStore.set).toHaveBeenCalledWith('test', '', { maxAge: -1 })
  })
})
