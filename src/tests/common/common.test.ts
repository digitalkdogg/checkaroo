import { formatDouble, convertToMySQLDate, convertToNiceDate, checkbadsqlstr, getDataFromCookie, setExpireDT } from '@/common/common'
import moment from 'moment'

// Mock DOMParser if needed, but for now we won't test decodeHtmlEntities which uses it
// Or we can mock it here:
global.DOMParser = class {
  parseFromString(text: string, type: string) {
    return {
      documentElement: {
        textContent: text,
      },
    } as any;
  }
} as any;

describe('common helpers', () => {
  test('formatDouble', () => {
    expect(formatDouble(10.5)).toBe('10.50')
    expect(formatDouble(10)).toBe('10.00')
    // @ts-ignore
    expect(formatDouble(null)).toBe(0)
  })

  test('convertToMySQLDate', () => {
    const date = new Date(2023, 0, 1, 10, 0, 0)
    const result = convertToMySQLDate(date)
    expect(result).toBe('2023-01-01 10:00:00')
  })

  test('convertToNiceDate', () => {
    const result = convertToNiceDate('2023-01-01 10:00:00')
    expect(result).toBe('01-01-2023')
  })

  test('checkbadsqlstr', () => {
    expect(checkbadsqlstr('select from users')).toBe(true)
    expect(checkbadsqlstr('update table set x=1')).toBe(true)
    expect(checkbadsqlstr('insert into table')).toBe(true)
    expect(checkbadsqlstr('delete from table')).toBe(true)
    expect(checkbadsqlstr('hello world')).toBe(false)
  })

  test('getDataFromCookie', () => {
    const cookiestr = 'user:kevin||id:123'
    const result = getDataFromCookie(cookiestr)
    expect(result).toEqual({ user: 'kevin', id: '123' })
    
    expect(getDataFromCookie('select from users')).toBe('')
  })

  test('setExpireDT', () => {
    const result = setExpireDT()
    const expected = moment().add(12, 'hours').format('Y-MM-DD HH:mm:ss')
    expect(result).toBe(expected)
  })
})
