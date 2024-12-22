import { upload } from '@tauri-apps/plugin-upload';

export namespace Tinify{
	export interface CompressResult{
		input:{
			size:number;
			type:string;
		};
		output:{
			height:number;
			ratio:number;
			size:number;
			type:string;
			url:string;
			width:number;
		};
	}
}

export class Tinify{
	private static API_ENDPOINT = "https://api.tinify.com"
	apiKeys: string[] = [];
	apiKey64s: Map<string,string> = new Map();

  constructor(apiKeys: string[]){
		this.apiKeys = apiKeys.filter(Boolean);
		console.log('this.apiKeys',this.apiKeys)
		this.apiKey64s = new Map(this.apiKeys.map(apiKey=>[apiKey,btoa(`api:${apiKey}`)]))
	}

	public async compress(filePtah: string,mime:string){
		return new Promise(async(resolve,reject)=>{
			const apiKey = this.apiKey64s.get(this.apiKeys[0]) || '';
			try{
				const headers = new Map<string,string>();
				headers.set('Content-Type',mime)
				headers.set('Authorization',`Basic ${apiKey}`)
				const result = await upload(
					`${Tinify.API_ENDPOINT}/shrink`,
					filePtah,
					undefined,
					headers
				);
				const payload = JSON.parse(result) as Tinify.CompressResult;
				const {output} = payload;
				resolve(output.url)
			}catch(error){
				console.log('tinypng:compress',error)
				reject(error)
			}
		})
	}
}