import { isEmpty } from "radash";
import { isAvailableTinifyExt } from ".";
import { Tinify } from "./tinify"
import { download } from '@tauri-apps/plugin-upload';

export namespace ProcessorType {
  
  export enum TaskType {
    Tinify = 'tinify',
    Local = 'local',
  }

  export enum TaskStatus {
    Pending = 'pending',
    Processing = 'processing',
    Completed = 'completed',
    Failed = 'failed',
  }

  export interface Task{
    path:string;
    ext:string;
    mime:string;
  }
  
  export interface TaskResult{
    id: Task['path'];
    type: TaskType;
    status: TaskStatus;
    path?: string;
    assetPath?: string;
    size?: number;
    errorMessage?: string;
  }
}

export default class Processor{

  private tinify:Tinify
  private concurrency:number = 6
  private tasks:Array<()=>Promise<ProcessorType.TaskResult>> = []
  private taskResults:Array<ProcessorType.TaskResult> = []
  private fulfilledCb:((res:ProcessorType.TaskResult)=>void) | undefined
  private rejectedCb:((res:ProcessorType.TaskResult)=>void) | undefined
  
  constructor(){
    this.tinify = new Tinify(['mH8J9qCNZ01kVYyt4m4swL8knjHX26bF'])
  }

  public setTasks(tasks:Array<ProcessorType.Task>){
    this.tasks = tasks.map(task=>{
      if(isAvailableTinifyExt(task.ext)){
        return ()=>{
          return new Promise( async(resolve,reject)=>{
            this.tinify
            .compress(task.path,task.mime)
            .then((res)=>{
              resolve({
                id:task.path,
                status:ProcessorType.TaskStatus.Completed,
                type:ProcessorType.TaskType.Tinify,
                path: res.output.url,
                assetPath:res.output.url,
                size:res.output.size
              })
            })
            .catch((error)=>{
              reject({
                id:task.path,
                status:ProcessorType.TaskStatus.Failed,
                type:ProcessorType.TaskType.Tinify,
                errorMessage:error.toString()
              })
            })
          })
        }
      }else{
        return async ()=>{
          return {
            type:ProcessorType.TaskType.Local,
            id:task.path,
            path:'',
            assetPath:'',
            size:0
          } as ProcessorType.TaskResult
        }
      }
    })
    return this;
  }

  public setFulfilledCb(cb:(res:ProcessorType.TaskResult)=>void){
    this.fulfilledCb = cb;
    return this;
  }

  public setRejectedCb(cb:(res:ProcessorType.TaskResult)=>void){
    this.rejectedCb = cb;
    return this;
  }

  private execute(
    tasks: (() => Promise<ProcessorType.TaskResult>)[], 
    fulfilledCb?: (result: ProcessorType.TaskResult) => void, 
    rejectedCb?: (result: ProcessorType.TaskResult) => void, 
    concurrency = 6
  ) {
    let i = 0;
    const ret:Array<Promise<any>> = [];
    const executing:Array<Promise<any>> = [];
    const enqueue = function (): Promise<void | any[]> {
      if (i === tasks.length) {
        return Promise.resolve();
      }
      const task = tasks[i++];
      const p = Promise.resolve()
        .then(() => task())
        .then((res) => {
          fulfilledCb?.(res);
          return res;
        })
        .catch((error) => {
          rejectedCb?.(error);
        });
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


  async run() {
    this.taskResults = await this.execute(this.tasks,this.fulfilledCb,this.rejectedCb,this.concurrency);
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