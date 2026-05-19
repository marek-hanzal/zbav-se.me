import { Context } from "effect";

export interface MailContext {
	host: string;
	port: number;
	username: string;
	password: string;
	from: string;
}

export class MailContextFx extends Context.Tag("MailContextFx")<MailContextFx, MailContext>() {
	//
}
