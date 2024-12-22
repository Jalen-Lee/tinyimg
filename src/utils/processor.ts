import { Tinify } from "./tinify"

export interface ProcessorTask{
  path:string;
  ext:string;
  mime:string;
}

export interface ProcessorTaskResult{
  path:string;
  ext:string;
  mime:string;
  size:number;
}

export default class Processor{

  private tinify:Tinify
  private tasks:Array<()=>Promise<any>> = []
  private fulfilledCb:((res:ProcessorTaskResult)=>void) | undefined
  private rejectedCb:((res:any)=>void) | undefined
  constructor(){
    this.tinify = new Tinify(['mH8J9qCNZ01kVYyt4m4swL8knjHX26bF123'])
  }

  public setTasks(tasks:Array<ProcessorTask>){
    this.tasks = tasks.map(task=>{
      return async ()=>{
        const result = await this.tinify.compress(task.path,task.mime)
        return result
      }
    })
    return this;
  }

  public setFulfilledCb(cb:(res)=>void){
    this.fulfilledCb = cb;
    return this;
  }

  public setRejectedCb(cb:(err)=>void){
    this.rejectedCb = cb;
    return this;
  }

  private execute<T>(tasks: (() => Promise<T>)[], fulfilledCb: (res: any) => void, rejectedCb: (res: any) => void, concurrency = 6) {
    let i = 0;
    const ret:Array<Promise<T>> = [];
    const executing:Array<Promise<T>> = [];
    const enqueue = function (): Promise<void | T[]> {
      if (i === tasks.length) {
        return Promise.resolve();
      }
      const task = tasks[i++];
      const p = Promise.resolve()
        .then(() => task())
        .then((res) => {
          fulfilledCb(res);
          return res;
        })
        .catch((e) => {
          rejectedCb(e);
        });
      // @ts-ignore
      ret.push(p);

      let r = Promise.resolve();
      if (concurrency <= tasks.length) {
        // @ts-ignore
        const e = p.then(() => {
          return executing.splice(executing.indexOf(e), 1);
        });
        executing.push(e);
        if (executing.length >= concurrency) {
          // @ts-ignore
          r = Promise.race(executing);
        }
      }
      return r.then(() => enqueue());
    };
    return enqueue().then(() => Promise.all(ret));
  }


  run(): Promise<any[]> {
    return this.execute(this.tasks,(res)=>{
      this.fulfilledCb?.(res)
    },(err)=>{
      this.rejectedCb?.(err)
    })
  }
}