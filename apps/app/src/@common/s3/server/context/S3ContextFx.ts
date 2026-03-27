import { Context } from "effect";

export interface S3Context {
	api: string;
	key: string;
	secret: string;
	bucket: string;
}

export class S3ContextFx extends Context.Tag("S3ContextFx")<S3ContextFx, S3Context>() {}
