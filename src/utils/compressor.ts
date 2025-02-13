import { isFunction } from "radash";
import Scheduler from "./scheduler";
import { Tinify } from "./tinify";
import { download } from "@tauri-apps/plugin-upload";


export interface CompressorOptions{
  concurrency:number;
}


export namespace ICompressor{
  export interface CompressTask{
    filePtah:string;
    mimeType:string;
  }

  export type QuickCompressTask = CompressTask & {
    target:string;
  };
  
  export type QuickCompressResult = Tinify.CompressResult & {
    source:string;
    target:string;
  };

  export interface SaveTask{
    id:string;
    source:string;
    target:string;
  }

  export interface SaveResult{
    id:string;
    source:string;
    target:string;
  }
}

export default class Compressor{

  private concurrency:number;

  constructor(options:CompressorOptions){
    this.concurrency = options.concurrency || 6;
  }

  public async compress(tasks:ICompressor.CompressTask[],options:{
    tinypngApiKeys: string[];
    onFulfilled?: (res:Tinify.CompressResult) => void;
    onRejected?: (res:any) => void;
  }):Promise<Tinify.CompressResult[]>{
    const tinify = new Tinify(options.tinypngApiKeys);
    const candidates = tasks.map(task=>()=>tinify.compress(task.filePtah,task.mimeType));
    const scheduler = new Scheduler({
      concurrency:this.concurrency,
    })
    .addListener(Scheduler.Events.Fulfilled,(res)=>{
      isFunction(options?.onFulfilled) && options.onFulfilled(res);
    })
    .addListener(Scheduler.Events.Rejected,(res)=>{
      isFunction(options?.onRejected) && options.onRejected(res);
    })
    .setTasks(candidates);
    return scheduler.run();
  }

  public async quickCompress(tasks:ICompressor.QuickCompressTask[],options:{
    tinypngApiKeys: string[];
    onFulfilled?: (res:ICompressor.QuickCompressResult) => void;
    onRejected?: (res:any) => void;
  }){
    const tinify = new Tinify(options.tinypngApiKeys);
    const candidates = tasks.map(task=>async()=>{
      const res = await tinify.compress(task.filePtah,task.mimeType);
      await download(res.output.url,task.target);
      return {
        ...res,
        source:res.output.url,
        target:task.target,
      }
    });
    const scheduler = new Scheduler({
      concurrency:this.concurrency,
    })
    .addListener(Scheduler.Events.Fulfilled,(res)=>{
      isFunction(options?.onFulfilled) && options.onFulfilled(res);
    })
    .addListener(Scheduler.Events.Rejected,(res)=>{
      isFunction(options?.onRejected) && options.onRejected(res);
    })
    .setTasks(candidates);
    return scheduler.run();
  }

  public async save(tasks:ICompressor.SaveTask[],options:{
    onFulfilled?: (res: ICompressor.SaveResult) => void;
    onRejected?: (res:any) => void;
  }){
    const candidates = tasks.map(task=>async()=>{
      await download(task.source,task.target);
      return {
        id:task.id,
        source:task.source,
        target:task.target,
      }
    });
    const scheduler = new Scheduler({
      concurrency: this.concurrency,
    })
    .addListener(Scheduler.Events.Fulfilled,(res)=>{
      isFunction(options?.onFulfilled) && options.onFulfilled(res);
    })
    .addListener(Scheduler.Events.Rejected,(res)=>{
      isFunction(options?.onRejected) && options.onRejected(res);
    })
    .setTasks(candidates);
    return scheduler.run();
  }


}