import { upload } from '@tauri-apps/plugin-upload';

export namespace Tinify{
	export interface ApiCompressResult{
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
	export interface CompressResult extends ApiCompressResult{
		id:string;
	}
}

export class Tinify{
	private static API_ENDPOINT = "https://api.tinify.com"
	apiKeys: string[] = [];
	apiKey64s: Map<string,string> = new Map();

  constructor(apiKeys: string[]){
		this.apiKeys = apiKeys.filter(Boolean);
		this.apiKey64s = new Map(this.apiKeys.map(apiKey=>[apiKey,btoa(`api:${apiKey}`)]))
	}

	public async compress(filePtah: string,mime:string):Promise<Tinify.CompressResult>{
		return new Promise<Tinify.CompressResult>(async(resolve,reject)=>{
			const apiKey = this.apiKey64s.get(this.apiKeys[0]) || '';
			if(!apiKey){
				return reject(new Error('[AccountError]: Authentication failed. Have you set the API Key? Verify your API key.'))
			}
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
				const payload = JSON.parse(result) as Tinify.ApiCompressResult;
				resolve({
					id: filePtah,
					input:payload.input,
					output:payload.output
				})
			}catch(error){
				reject(error)
			}
		})
	}
}