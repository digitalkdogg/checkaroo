export const writelog = (msg:string) => {
    try {
        process.stdout.write(msg.toString())
    } catch (e) {
        return;
    }
}