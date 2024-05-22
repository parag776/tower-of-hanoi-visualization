export async function pause(timeInSeconds){
    return new Promise((resolve, reject)=>setTimeout(()=>{
        resolve();
    }, timeInSeconds*1000));
}