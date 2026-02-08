import { Effect } from "effect";
import type { z } from "zod";
import { zodFx } from "./zodFx";

export namespace zodGuardFx {
	export interface Props<TSchema extends z.ZodSchema, TDataError, TDataContext> {
		schema: TSchema;
		dataFx: Effect.Effect<z.infer<TSchema>, TDataError, TDataContext>;
	}
}

/**
 * Like {@link zodFx}, but enforces at the type level that the schema's inferred type
 * and the success type of `dataFx` match. Use this when the data source is already
 * typed to match the schema (e.g. DB query with typed result); the runtime validation
 * still runs, but the type system guarantees the contract.
 */
export const zodGuardFx = Effect.fn("zodGuardFx")(function* <
	TSchema extends z.ZodSchema,
	TDataError,
	TDataContext,
>(props: zodGuardFx.Props<TSchema, TDataError, TDataContext>) {
	return yield* zodFx(props);
});
