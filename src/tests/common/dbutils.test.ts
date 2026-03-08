import { select, insert, update, deleteRec } from '@/common/dbutils'
import pool from '@/common/db'

jest.mock('@/common/db', () => ({
  getConnection: jest.fn(),
}))

describe('dbutils', () => {
  let mockConnection: any;

  beforeEach(() => {
    mockConnection = {
      query: jest.fn(),
      execute: jest.fn(),
      release: jest.fn(),
    };
    (pool.getConnection as jest.Mock).mockResolvedValue(mockConnection)
  })

  test('select', async () => {
    const query = {
      select: 'col1',
      from: 'table1',
      where: 'id=1'
    }
    mockConnection.execute.mockResolvedValue([[{ col1: 'val1' }], []])
    
    const result = await select(query)
    expect(result).toEqual([{ col1: 'val1' }])
    expect(mockConnection.execute).toHaveBeenCalledWith('select col1 from table1 where id=1', [])
  })

  test('insert', async () => {
    const query = {
      table: 'table1',
      fields: ['f1', 'f2'],
      vals: ['v1', 'v2']
    }
    mockConnection.execute.mockResolvedValue([{ insertId: 1 }, []])
    
    const result = await insert(query)
    expect(result).toEqual({ data: { insertId: 1 } })
    expect(mockConnection.execute).toHaveBeenCalledWith('insert into table1 (f1, f2) values (?, ?)', ['v1', 'v2'])
  })

  test('update', async () => {
    const query = {
      table: 'table1',
      fields: 'f1="v1"',
      fieldVals: [],
      where: 'id=1'
    }
    mockConnection.execute.mockResolvedValue([{ affectedRows: 1 }, []])
    
    const result = await update(query)
    expect(result).toEqual({ data: { affectedRows: 1 } })
    expect(mockConnection.execute).toHaveBeenCalledWith('update table1 set f1="v1" where id=1', [])
  })

  test('deleteRec', async () => {
    const query = {
      from: 'table1',
      where: 'id=1'
    }
    mockConnection.execute.mockResolvedValue([{ affectedRows: 1 }, []])
    
    const result = await deleteRec(query)
    expect(result).toBe(true)
    expect(mockConnection.execute).toHaveBeenCalledWith('DELETE FROM table1 where id=1', [])
  })
})
