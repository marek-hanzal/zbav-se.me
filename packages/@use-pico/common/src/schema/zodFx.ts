import { Effect } from "effect";
import type z from "zod";
import { ZodErrorFx } from "../error/ZodErrorFx";

export namespace zodFx {
	export interface Props<TSchema extends z.ZodSchema> {
		schema: TSchema;
		data: unknown;
	}
}

export const zodFx = Effect.fn("zodFx")(function* <TSchema extends z.ZodSchema>({
	schema,
	data,
}: zodFx.Props<TSchema>) {
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
