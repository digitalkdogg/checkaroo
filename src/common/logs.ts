export const writelog = (msg:string | object, premsg?:string) => {

    try {
        if (typeof msg == 'object') {
            if (!premsg) {
                const premsg = '';
            }
           const keys = Object.keys(msg)
           process.stdout.write('\n' + premsg);
           keys.forEach((val, index)=> {
            process.stdout.write('\n' + val + '\n' )
           })
        } else {
             if (premsg) {
                msg = premsg + '\n' + msg
            } 
            process.stdout.write('\n' + msg.toString() + '\n')
        }
    } catch (error) {
       return;
    }
}