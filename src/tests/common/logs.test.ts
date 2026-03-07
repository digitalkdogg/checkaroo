import { writelog } from '@/common/logs'

describe('logs', () => {
  let originalWrite: any;
  let mockWrite: jest.Mock;

  beforeEach(() => {
    originalWrite = process.stdout.write;
    mockWrite = jest.fn();
    process.stdout.write = mockWrite as any;
  })

  afterEach(() => {
    process.stdout.write = originalWrite;
  })

  test('writelog string', () => {
    writelog('test message', 'test premsg')
    expect(mockWrite).toHaveBeenCalled()
    const allCalls = mockWrite.mock.calls.map(call => call[0]).join('')
    expect(allCalls).toContain('test message')
    expect(allCalls).toContain('test premsg')
  })

  test('writelog object', () => {
    writelog({ key: 'val' }, 'test premsg')
    expect(mockWrite).toHaveBeenCalled()
    const allCalls = mockWrite.mock.calls.map(call => call[0]).join('')
    expect(allCalls).toContain('key')
    expect(allCalls).toContain('test premsg')
  })
})
