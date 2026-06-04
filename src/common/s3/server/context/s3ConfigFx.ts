import { Context } from "effect";

export interface s3Config {
	api: string;
	key: string;
	secret: string;
	bucket: string;
}

export class s3ConfigFx extends Context.Tag("s3ConfigFx")<s3ConfigFx, s3Config>() {
	//
}
