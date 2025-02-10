import { isFunction } from "radash";
import Scheduler, { SchedulerOptions } from "./scheduler";
import { Tinify } from "./tinify";

export interface CompressorOptions{
  concurrency:number;
  tinypngApiKeys: string[];
}


export namespace ICompressor{
  export interface Task{
    filePtah:string;
    mimeType:string;
  }
}

export default class Compressor{

  private concurrency:number;
  private tinify:Tinify;
  private tasks:ICompressor.Task[] = [];

  constructor(options:CompressorOptions){
    this.concurrency = options.concurrency || 6;
    this.tinify = new Tinify(options.tinypngApiKeys);
  }

  public addTask(task:ICompressor.Task){
    this.tasks.push(task);
    return this;
  }

  public addTasks(tasks:ICompressor.Task[]){
    this.tasks.push(...tasks);
    return this;
  }

  public async compress(options?:{
    onFulfilled?: (res:Tinify.CompressResult) => void;
    onRejected?: (res:any) => void;
  }):Promise<Tinify.CompressResult[]>{
    const tasks = this.tasks.map(task=>()=>this.tinify.compress(task.filePtah,task.mimeType));
    const scheduler = new Scheduler({
      concurrency:this.concurrency,
    })
    .addListener(Scheduler.Events.Fulfilled,(res)=>{
      isFunction(options?.onFulfilled) && options.onFulfilled(res);
    })
    .addListener(Scheduler.Events.Rejected,(res)=>{
      isFunction(options?.onRejected) && options.onRejected(res);
    })
    .setTasks(tasks);
    return scheduler.run();
  }


  public async save(options:{
    onFulfilled?: (res:Tinify.CompressResult) => void;
    onRejected?: (res:any) => void;
  }){

    
  }
}