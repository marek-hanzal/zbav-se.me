import { Context } from "effect";

export interface MailContext {
	key: string;
	from: string;
}

export class MailContextFx extends Context.Tag("MailContextFx")<MailContextFx, MailContext>() {
	//
}
