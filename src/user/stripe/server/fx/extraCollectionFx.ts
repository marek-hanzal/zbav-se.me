import { Effect } from "effect";
import { getLoggerFx } from "@/lib/common/log";
import type { ExtraSchema } from "../schema/ExtraSchema";
import { catalogFx } from "./catalogFx";

export const extraCollectionFx = Effect.fn("extraCollectionFx")(function* () {
	const logger = yield* getLoggerFx("extraCollectionFx");
	logger.trace("extraCollectionFx");

	const bundles = yield* catalogFx({
		type: "extra",
		priceMode: "one-time",
	});

	return bundles.map(
		({ id: _id, interval: _interval, sort: _sort, ...bundle }): ExtraSchema.Type => bundle,
	);
});

export type extraCollectionFx = ReturnType<typeof extraCollectionFx>;
