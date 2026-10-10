import { Effect } from "effect";
import { withFlagSelectFx } from "~/buyer-listing-flag/db/withFlagSelectFx";
import type { FlagQuerySchema } from "~/buyer-listing-flag/schema/FlagQuerySchema";
import type { FlagWhereSchema } from "~/buyer-listing-flag/schema/FlagWhereSchema";
import { withFetchFx } from "~/http/fx/withFetchFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";

export namespace flagFetchFx {
	export interface Props extends FlagQuerySchema.Type {
		scope: FlagWhereSchema.Type;
	}
}

export const flagFetchFx = Effect.fn("flagFetchFx")(function* ({
	where,
	sort,
	scope,
}: flagFetchFx.Props) {
	const logger = yield* getLoggerFx("flagFetchFx");
	logger.trace("flagFetchFx", {
		where,
		sort,
		scope,
	});

	return yield* withFetchFx({
		resource: "listing_flag",
		selectFx: withFlagSelectFx({
			sort,
		}),
		where,
		scope,
	});
});

export type flagFetchFx = ReturnType<typeof flagFetchFx>;
