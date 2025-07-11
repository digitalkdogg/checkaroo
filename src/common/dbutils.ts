import pool from '@/common/db'
import {FieldPacket, QueryResult, ResultSetHeader} from 'mysql2'
import {writelog} from '@/common/logs';

interface UpdateQuery {
    table?: string,
    fields?: string, 
    where? : string,
    sort? : string,
    limit?:string
}

interface SelectQuery {
    select?: string,
    from?: string,
    join?: [],
    where?: string,
    sort?: string,
    limit?: string
}

interface InsertQuery {
    table?: string,
    fields: [],
    vals: []
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
    } catch(err:any) {
        writelog(err.toString(), '==============database select error ====================')
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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const data = await connection.execute(querystr, query.vals);
            return {data} 
        } catch(e:any) {
            writelog(e.toString(), '==============database insert error ====================')
            return {err: e}
        } finally {
            if (connection) connection.release()
        }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const update = async (query:UpdateQuery) => {

    let querystr = '' 
    querystr = querystr + 'update '+ query.table
    querystr = querystr + ' set ' + query.fields

    if (query.where) {
        querystr = querystr + ' where ' + query.where
    }

    if (query.sort) {
        querystr = querystr + ' order by ' + query.sort
    }

    if (query.limit) {
        querystr = querystr + ' limit ' + query.limit
    }

    let connection
    try {
        connection = await pool.getConnection();
        writelog(querystr)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data:any = await connection.execute(querystr);
        
        return {data}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e:any) {
        writelog(e.toString(), '---------------database update error ----------------------')
        return {err: e}
    } finally {
         if (connection) connection.release()
    }
}
