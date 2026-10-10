import { Effect } from "effect";
import { withIgnoreSelectFx } from "~/buyer-listing-ignore/db/withIgnoreSelectFx";
import type { IgnoreQuerySchema } from "~/buyer-listing-ignore/schema/IgnoreQuerySchema";
import type { IgnoreWhereSchema } from "~/buyer-listing-ignore/schema/IgnoreWhereSchema";
import { withFetchFx } from "~/http/fx/withFetchFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";

export namespace ignoreFetchFx {
	export interface Props extends IgnoreQuerySchema.Type {
		scope: IgnoreWhereSchema.Type;
	}
}

export const ignoreFetchFx = Effect.fn("ignoreFetchFx")(function* ({
	where,
	scope,
	sort,
}: ignoreFetchFx.Props) {
	const logger = yield* getLoggerFx("ignoreFetchFx");
	logger.trace("ignoreFetchFx", {
		where,
		scope,
		sort,
	});

	return yield* withFetchFx({
		resource: "listing_ignore",
		selectFx: withIgnoreSelectFx({
			sort,
		}),
		where,
		scope,
	});
});

export type ignoreFetchFx = ReturnType<typeof ignoreFetchFx>;
