import pool from '@/common/db'
import mysql from 'mysql2/promise';

export const select = async (query:any) => {
    var querystr = ''
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
    
    try {
        const [rows] = await pool.query(querystr);
        return rows;
    } catch(err) {
        return {'err': err, 'querystr': query}
    }
    pool.end
}

export const insert = async (query:any) => {
        var querystr = ''
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

        const data:any = await pool.execute(querystr, query.vals);
        return {data} 

}