import { Effect } from "effect";
import { withFetchFx } from "@/lib/common/fetch";
import { getLoggerFx } from "@/lib/common/log";
import { withFlagSelectFx } from "~/buyer/flag/server/db/withFlagSelectFx";
import type { FlagFilterSchema } from "~/buyer/flag/server/schema/FlagFilterSchema";
import type { FlagQuerySchema } from "~/buyer/flag/server/schema/FlagQuerySchema";

export namespace flagFetchFx {
	export interface Props extends FlagQuerySchema.Type {
		scope: FlagFilterSchema.Type;
	}
}

export const flagFetchFx = Effect.fn("flagFetchFx")(function* ({
	filter,
	where,
	sort,
	scope,
}: flagFetchFx.Props) {
	const logger = yield* getLoggerFx("flagFetchFx");
	logger.trace("flagFetchFx", {
		filter,
		where,
		sort,
		scope,
	});

	return yield* withFetchFx({
		resource: "flag",
		selectFx: withFlagSelectFx({
			sort,
		}),
		filter,
		where,
		scope,
	});
});

export type flagFetchFx = ReturnType<typeof flagFetchFx>;
