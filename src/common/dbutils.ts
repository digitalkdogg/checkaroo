import pool from '@/common/db'
import {writelog} from '@/common/logs';
import { ResultSetHeader, FieldPacket } from 'mysql2/promise';

interface UpdateQuery {
    table?: string,
    fields?: string, 
    where? : string,
    sort? : string,
    limit?:number | string
}

interface SelectQuery {
    select?: string,
    from?: string,
    join?: string[] | [],
    where?: string,
    sort?: string,
    limit?: number | string
}


interface InsertQuery {
    table?: string,
    fields: string[]|[],
    vals: string[]|[]
}

interface DeleteQeury {
    from: string,
    where: string,
    limit?: number | string
}

export const select = async (query:SelectQuery) => {
    let querystr = ''
    querystr = querystr + 'select ' + query.select
    querystr = querystr + ' from ' + query.from

    
    if (query.join) {
        for (let x = 0; x<query.join.length; x++) {
            querystr = querystr + ' ' + query.join[x]
        }
    }

    if (query.where) {
        querystr = querystr + ' where ' + query.where
    }

    if (query.sort) {
        querystr = querystr + ' order by ' + query.sort
    }

    if (query.limit) {
        querystr = querystr + ' limit ' + query.limit
    }
    
    let connection;
    try {
        connection = await pool.getConnection();
        writelog(querystr)

        const [rows] = await connection.query(querystr);
        return rows;
    } catch(err:unknown) {
        writelog(String(err), '==============database select error ====================')
        return {'err': err}
    } finally {
        if (connection) connection.release()
    }
}

export const insert = async (query:InsertQuery) => {
    let querystr = ''
    querystr = querystr + 'insert into '
    querystr = querystr + query.table + '('
    
    for (let x =0; x<query.fields.length; x++) {
        querystr = querystr + query.fields[x]
        if (x<query.fields.length-1) {
            querystr = querystr + ','
        }
    }

    querystr = querystr + ')values('

    for (let x=0; x<query.vals.length; x++) {
        querystr = querystr + '?'
        if (x<query.vals.length-1) {
            querystr = querystr + ','
        } else {
            querystr = querystr + ')'
        }
    }

    let connection
    try { 
        connection = await pool.getConnection();
        writelog(querystr + ':::' + query.vals.toString())
        
        const data = await connection.execute(querystr, query.vals);
        return {data} 
            
    } catch(e:unknown) {
        writelog(String(e), '==============database insert error ====================')
        return {err: e}
    } finally {
        if (connection) connection.release()
    }
}

export const update = async (query: UpdateQuery) => {
    let querystr = '';
    querystr += 'update ' + query.table;
    querystr += ' set ' + query.fields;

    if (query.where) {
        querystr += ' where ' + query.where;
    }

    if (query.sort) {
        querystr += ' order by ' + query.sort;
    }

    if (query.limit) {
        querystr += ' limit ' + query.limit;
    }

    let connection;
    try {
        connection = await pool.getConnection();
        writelog(querystr);

        const [result]: [ResultSetHeader, FieldPacket[]] = await connection.execute(querystr);
        return { data: result };
    } catch (e: unknown) {
        writelog(String(e), '---------------database update error ----------------------');
        return { err: e };
    } finally {
        if (connection) connection.release();
    }
}

export const deleteRec = async (query: DeleteQeury): Promise<boolean> => {
    let querystr = 'DELETE FROM ' + query.from;
    querystr += ' where ' + query.where;

    if (query.limit) {
        querystr += ' limit ' + query.limit;
    }

    let connection;
    try {
        connection = await pool.getConnection();
        const [result]: [ResultSetHeader, FieldPacket[]] = await connection.execute(querystr);
        
        // You can check affectedRows to confirm delete
        return result.affectedRows > 0;
    } catch (e: unknown) {
        writelog(String(e), '---------------database delete error ----------------------');
        return false;
    } finally {
        if (connection) connection.release();
    }
};