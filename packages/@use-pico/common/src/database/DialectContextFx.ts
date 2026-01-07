import { Context, Effect } from "effect";
import type { Dialect } from "kysely";

export type DialectContext = Dialect;

export class DialectContextFx extends Context.Tag("DialectContextFx")<
	DialectContextFx,
	DialectContext
>() {
	//
}

export const DialectContextProvider = (context: DialectContext) => {
	return Effect.provideService(DialectContextFx, context);
};
