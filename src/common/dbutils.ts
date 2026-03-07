import pool from '@/common/db'
import {writelog} from '@/common/logs';
import { ResultSetHeader, FieldPacket } from 'mysql2/promise';
import type { QueryValue } from 'mysql2/promise';

type QueryParams = QueryValue[];

interface UpdateQuery {
    table?: string,
    fields?: string,
    fieldVals: QueryParams, 
    where? : string,
    whereVals?: QueryParams,
    sort? : string,
    limit?:number | string
}

interface SelectQuery {
    select?: string,
    from?: string,
    join?: string[]|[],
    where?: string,
    whereVals?: QueryParams, 
    sort?: string,
    limit?: number | string
}


interface InsertQuery {
    table?: string,
    fields: string[]|[],
    vals: QueryParams
}

interface DeleteQeury {
    from: string,
    where: string,
    whereVals: QueryParams, 
    limit?: number | string
}

export const select = async (query:SelectQuery) => {
    const params: QueryParams = [];

    let querystr = `select ${query.select} from ${query.from}`;

    
    if (query.join) {
         querystr += ' ' + query.join.join(' ');
    }

    if (query.where) {
        querystr += ' where ' + query.where;
        if (query.whereVals && query.whereVals.length > 0) {
            params.push(...query.whereVals);
        }
    }

    if (query.sort) {
         querystr += ' order by ' + query.sort;
    }

    if (query.limit !== undefined) {
        querystr += ' limit ' + query.limit;
    }
    
    let connection;
    try {
        connection = await pool.getConnection();
        writelog(querystr)
        writelog('PARAMS: ' + JSON.stringify(params))

        const [rows] = await connection.execute(querystr, params);
        return rows;
    } catch(err:unknown) {
        writelog(String(err), '==============database select error ====================')
        return {err}
    } finally {
        if (connection) connection.release()
    }
}

export const insert = async (query:InsertQuery) => {
    const fieldList = query.fields.join(', ');
    const placeholders = query.fields.map(() => '?').join(', ');
    const querystr = `insert into ${query.table} (${fieldList}) values (${placeholders})`;

    let connection
    try {
        connection = await pool.getConnection();
        writelog(querystr + ':::' + query.vals.toString())
        writelog('INSERT PARAMS: ' + JSON.stringify(query.vals))

        const [result]: [ResultSetHeader, FieldPacket[]] = await connection.execute(querystr, query.vals);
        return { data: result };
            
    } catch(e:unknown) {
        writelog(String(e), '==============database insert error ====================')
        return {err: e}
    } finally {
        if (connection) connection.release()
    }
}

export const update = async (query: UpdateQuery) => {
    const params: QueryParams = [...query.fieldVals];
    if (query.whereVals && query.whereVals.length > 0) {
        params.push(...query.whereVals);
    }

    let querystr = `update ${query.table} set ${query.fields}`;

    if (query.where) {
        querystr += ' where ' + query.where;
    }

    if (query.sort) {
        querystr += ' order by ' + query.sort;
    }

    if (query.limit !== undefined) {
        querystr += ' limit ' + query.limit;
    }

    let connection;
    try {
        connection = await pool.getConnection();
        writelog(querystr);
        writelog('UPDATE PARAMS: ' + JSON.stringify(params));

        const [result]: [ResultSetHeader, FieldPacket[]] = await connection.execute(querystr, params);
        return { data: result };
    } catch (e: unknown) {
        writelog(String(e), '---------------database update error ----------------------');
        return { err: e };
    } finally {
        if (connection) connection.release();
    }
}

export const deleteRec = async (query: DeleteQeury): Promise<boolean> => {
    const params: QueryParams = [...(query.whereVals || [])];

    let querystr = `DELETE FROM ${query.from} where ${query.where}`;

    if (query.limit !== undefined) {
        querystr += ' limit ' + query.limit;
    }

    let connection;
    try {
        connection = await pool.getConnection();
        const [result]: [ResultSetHeader, FieldPacket[]] = await connection.execute(querystr, params);
        
        // You can check affectedRows to confirm delete
        return result.affectedRows > 0;
    } catch (e: unknown) {
        writelog(String(e), '---------------database delete error ----------------------');
        return false;
    } finally {
        if (connection) connection.release();
    }
};

export const canConnect = async () => {
  let connection;
  try {
    connection = await pool.getConnection();
    return true;
  } catch (e) {
    return false;
  } finally {
    if (connection) connection.release();
  }
};