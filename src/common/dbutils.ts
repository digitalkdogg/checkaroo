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
    
    try {
        const [rows] = await pool.query(querystr);
        return rows;
    } catch(err) {
        return {'err': err, 'querystr': query}
    }
    pool.end
}