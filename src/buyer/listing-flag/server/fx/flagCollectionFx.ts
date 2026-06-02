import { Effect } from "effect";
import { withCollectionFx } from "@/lib/common/collection";
import { getLoggerFx } from "@/lib/common/log";
import { withFlagSelectFx } from "~/buyer/listing-flag/server/db/withFlagSelectFx";
import type { FlagQuerySchema } from "~/buyer/listing-flag/server/schema/FlagQuerySchema";
import type { FlagWhereSchema } from "../schema/FlagWhereSchema";

export namespace flagCollectionFx {
	export interface Props extends FlagQuerySchema.Type {
		scope: FlagWhereSchema.Type;
	}
}

export const flagCollectionFx = Effect.fn("flagCollectionFx")(function* ({
	cursor = {
		page: 0,
		size: 10,
	},
	limit,
	where,
	scope,
	sort,
}: flagCollectionFx.Props) {
	const logger = yield* getLoggerFx("flagCollectionFx");
	logger.trace("flagCollectionFx", {
		cursor,
		limit,
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
		where,
		scope,
	});
});

export type flagCollectionFx = ReturnType<typeof flagCollectionFx>;
