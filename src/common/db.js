   // lib/db.js
    import mysql from 'mysql2/promise';

    const env = process.env.NODE_ENV;
    
    const getHost = () => {
      if (env == 'development') {
        if (process.env.DB_HOST_DEV) {
          return process.env.DB_HOST_DEV
        } else {
          return process.env.DB_HOST
        }
      } else {
        return process.env.DB_HOST
      }
    }

    const getUser = () => {
      if (env == 'development') {
        if (process.env.DB_USER_DEV) {
          return process.env.DB_USER_DEV
        } else {
          return process.env.DB_USER
        }
      } else {
        return process.env.DB_USER
      }
    }

    const pool = mysql.createPool({
      host: getHost(),
      user: getUser(),
      password: process.env.DB_PASS,
      database: process.env.DB_DATABASE,
      port: process.env.DB_PORT,
      waitForConnections: true,
      connectionLimit: 1,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 10
    });

    export default pool;
