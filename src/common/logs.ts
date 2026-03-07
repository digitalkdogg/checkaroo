    type LogLevel = 'debug' | 'info' | 'warn' | 'error';
    const isProduction = process.env.NODE_ENV === 'production';

    const shouldWriteLog = (level: LogLevel) => {
        if (!isProduction) {
            return true;
        }

        return level === 'warn' || level === 'error';
    };

    export const writelog = (msg:string | object, premsg?:string, level: LogLevel = 'info') => {

    if (!shouldWriteLog(level)) {
        return;
    }

    try {
        if (typeof msg == 'object') {
            if (premsg) {
                process.stdout.write('\n----------------' + premsg + '-----------------');
            }
           const keys = Object.keys(msg)
           keys.forEach((val)=> {
            process.stdout.write('\n' + val + '\n' )
           })
        } else {
             if (premsg) {
                msg = premsg + '\n' + msg
            } 
            process.stdout.write('\n' + msg.toString() + '\n')
        }
    } catch (error) {
        if (error) {
            return;
        }
    }
}