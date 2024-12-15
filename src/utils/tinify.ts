import { upload,download } from '@tauri-apps/plugin-upload';

export class Tinify{
	private static API_ENDPOINT = "https://api.tinify.com"
	apiKey: string = '';
	apiKey64: string = '';

  constructor(apiKey: string){
		this.apiKey = apiKey;
		this.apiKey64 = atob(`api:${apiKey}`)
	}

	public async compress(filePtah: string,mime:string){
		const headers = new Map<string,string>();
		headers.set('Content-Type',mime)
		headers.set('Authorization',this.apiKey64)
		const result = await upload(
			`${Tinify.API_ENDPOINT}/shrink`,
			filePtah,
			undefined,
			headers
		);
		const payload = JSON.parse(result);
		return payload;
	}
}