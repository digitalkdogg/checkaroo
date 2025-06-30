export const writelog = (msg:string, premsg?:string) => {
    try {
        if (premsg) {
            msg = premsg + '\n' + msg
        } 
        process.stdout.write('\n' + msg.toString() + '\n')
    } catch (e) {
        return;
    }
}