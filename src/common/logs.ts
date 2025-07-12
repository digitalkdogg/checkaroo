export const writelog = (msg:string | object, premsg?:string) => {

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