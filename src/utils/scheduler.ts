import { isEmpty } from "radash";
import { isAvailableTinifyExt } from ".";
import { Tinify } from "./tinify"
import { download } from '@tauri-apps/plugin-upload';

export namespace IScheduler {
  
  export type Task = ()=>Promise<TaskResult>;
  export type TaskResult = any;
  
  export enum TaskStatus {
    Pending = 'pending',
    Processing = 'processing',
    Completed = 'completed',
    Failed = 'failed',
  }
}

export interface SchedulerOptions{
  concurrency:number;
}

export default class Scheduler{

  private concurrency:number
  private tasks:Array<()=>Promise<IScheduler.TaskResult>> = []
  private results:Array<IScheduler.TaskResult> = []
  private fulfilledCb:((res:IScheduler.TaskResult)=>void) | undefined
  private rejectedCb:((res:IScheduler.TaskResult)=>void) | undefined
  
  constructor(options:SchedulerOptions){
    this.concurrency = options.concurrency || 6;
  }

  public setTasks(tasks:Array<IScheduler.Task>){
    // this.tasks = tasks.map(task=>{
    //   if(isAvailableTinifyExt(task.ext)){
    //     return ()=>{
    //       return new Promise( async(resolve,reject)=>{
    //         this.tinify
    //         .compress(task.path,task.mime)
    //         .then((res)=>{
    //           resolve({
    //             id:task.path,
    //             status:ProcessorType.TaskStatus.Completed,
    //             type:ProcessorType.TaskType.Tinify,
    //             path: res.output.url,
    //             assetPath:res.output.url,
    //             size:res.output.size
    //           })
    //         })
    //         .catch((error)=>{
    //           reject({
    //             id:task.path,
    //             status:ProcessorType.TaskStatus.Failed,
    //             type:ProcessorType.TaskType.Tinify,
    //             errorMessage:error.toString()
    //           })
    //         })
    //       })
    //     }
    //   }else{
    //     return async ()=>{
    //       return {
    //         type:ProcessorType.TaskType.Local,
    //         id:task.path,
    //         path:'',
    //         assetPath:'',
    //         size:0
    //       } as ProcessorType.TaskResult
    //     }
    //   }
    // })
    this.tasks = tasks;
    return this;
  }

  public setFulfilledCb(cb:(res:IScheduler.TaskResult)=>void){
    this.fulfilledCb = cb;
    return this;
  }

  public setRejectedCb(cb:(res:IScheduler.TaskResult)=>void){
    this.rejectedCb = cb;
    return this;
  }

  private execute() {
    let i = 0;
    const ret:Array<Promise<any>> = [];
    const executing:Array<Promise<any>> = [];
    const enqueue = (): Promise<void | any[]> => {
      if (i === this.tasks.length) {
        return Promise.resolve();
      }
      const task = this.tasks[i++];
      const p = Promise.resolve()
        .then(() => task())
        .then((res) => {
          this.fulfilledCb?.(res);
          return res;
        })
        .catch((res) => {
          this.rejectedCb?.(res);
        });
      ret.push(p);

      let r = Promise.resolve();
      if (this.concurrency <= this.tasks.length) {
        const e:Promise<any> = p.then(() => {
          return executing.splice(executing.indexOf(e), 1);
        });
        executing.push(e);
        if (executing.length >= this.concurrency) {
          r = Promise.race(executing);
        }
      }
      return r.then(() => enqueue());
    };
    return enqueue().then(() => Promise.all(ret));
  }


  async run() {
    this.results = await this.execute();
    return this;
  }

  

  // save(cb:(res:ProcessorType.TaskResult)=>void){
  //   if(!isEmpty(this.taskResults)){
  //     this.taskResults.filter(Boolean).forEach(async task=>{
  //       if(task.type === ProcessorType.TaskType.Tinify){
  //         const res = await download(
  //           task.path,
  //           './path/to/save/my/file.txt'
  //         );
  //       }
  //     })
  //   }
  // }

  // saveTo(filePath:string){

  // }

  // saveAsZip(filename:string){

  // }
}