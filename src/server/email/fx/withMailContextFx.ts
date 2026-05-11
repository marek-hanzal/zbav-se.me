import { Effect } from "effect";
import { type MailContext, MailContextFx } from "../context/MailContextFx";

export function withMailContextFx(context: MailContext) {
	return <A, E, R>(eff: Effect.Effect<A, E, R>) => {
		return eff.pipe(Effect.provideService(MailContextFx, context));
	};
}
