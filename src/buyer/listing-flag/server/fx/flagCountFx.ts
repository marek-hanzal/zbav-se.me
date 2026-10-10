import { Effect } from "effect";
import { withFlagSelectFx } from "~/buyer/listing-flag/server/db/withFlagSelectFx";
import type { FlagCountQuerySchema } from "~/buyer/listing-flag/server/schema/FlagCountQuerySchema";
import { withCountFx } from "~/database-query/fx/withCountFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import type { FlagWhereSchema } from "../schema/FlagWhereSchema";

export namespace flagCountFx {
	export interface Props extends FlagCountQuerySchema.Type {
		scope: FlagWhereSchema.Type;
	}
}

export const flagCountFx = Effect.fn("flagCountFx")(function* ({
	where,
	scope,
}: flagCountFx.Props) {
	const logger = yield* getLoggerFx("flagCountFx");
	logger.trace("flagCountFx", {
		where,
		scope,
	});

	return yield* withCountFx({
		selectFx: withFlagSelectFx({}),
		where,
		scope,
	});
});

export type flagCountFx = ReturnType<typeof flagCountFx>;
