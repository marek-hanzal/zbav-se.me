import { Effect } from "effect";
import type z from "zod";
import { ZodErrorFx } from "../error/ZodErrorFx";

export namespace zodFx {
	export interface Props<TSchema extends z.ZodSchema, TDataError, TDataContext> {
		schema: TSchema;
		dataFx: Effect.Effect<unknown, TDataError, TDataContext>;
	}
}

export const zodFx = Effect.fn("zodFx")(function* <
	TSchema extends z.ZodSchema,
	TDataError,
	TDataContext,
>({ schema, dataFx }: zodFx.Props<TSchema, TDataError, TDataContext>) {
	const data = yield* dataFx;

	const result = yield* Effect.promise(async () => {
		return schema.safeParseAsync(data);
	});

	if (result.success) {
		return result.data;
	}

	return yield* new ZodErrorFx({
		zod: result.error,
	});
});
