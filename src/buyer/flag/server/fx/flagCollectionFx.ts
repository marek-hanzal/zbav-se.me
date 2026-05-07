import { Effect } from "effect";
import { withCollectionFx } from "@/lib/common/collection";
import { getLoggerFx } from "@/lib/common/log";
import { withFlagSelectFx } from "~/buyer/flag/server/db/withFlagSelectFx";
import type { FlagFilterSchema } from "~/buyer/flag/server/schema/FlagFilterSchema";
import type { FlagQuerySchema } from "~/buyer/flag/server/schema/FlagQuerySchema";

export namespace flagCollectionFx {
	export interface Props extends FlagQuerySchema.Type {
		scope: FlagFilterSchema.Type;
	}
}

export const flagCollectionFx = Effect.fn("flagCollectionFx")(function* ({
	cursor = {
		page: 0,
		size: 10,
	},
	limit,
	filter,
	where,
	scope,
	sort,
}: flagCollectionFx.Props) {
	const logger = yield* getLoggerFx("flagCollectionFx");
	logger.trace("flagCollectionFx", {
		cursor,
		limit,
		filter,
		where,
		scope,
		sort,
	});

	return yield* withCollectionFx({
		selectFx: withFlagSelectFx({
			sort,
		}),
		cursor,
		limit,
		filter,
		where,
		scope,
	});
});

export type flagCollectionFx = ReturnType<typeof flagCollectionFx>;
