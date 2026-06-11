import { Context } from "effect";

export interface StripeConfig {
	secret: string;
	webhook: string;
}

export class StripeConfigFx extends Context.Tag("StripeConfigFx")<StripeConfigFx, StripeConfig>() {
	//
}
