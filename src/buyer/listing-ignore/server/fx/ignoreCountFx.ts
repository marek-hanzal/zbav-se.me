import { Effect } from "effect";
import { withIgnoreSelectFx } from "~/buyer/listing-ignore/server/db/withIgnoreSelectFx";
import type { IgnoreCountQuerySchema } from "~/buyer/listing-ignore/server/schema/IgnoreCountQuerySchema";
import { withCountFx } from "~/database-query/fx/withCountFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import type { IgnoreWhereSchema } from "../schema/IgnoreWhereSchema";

export namespace ignoreCountFx {
	export interface Props extends IgnoreCountQuerySchema.Type {
		scope: IgnoreWhereSchema.Type;
	}
}

export const ignoreCountFx = Effect.fn("ignoreCountFx")(function* ({
	where,
	scope,
}: ignoreCountFx.Props) {
	const logger = yield* getLoggerFx("ignoreCountFx");
	logger.trace("ignoreCountFx", {
		where,
		scope,
	});

	return yield* withCountFx({
		selectFx: withIgnoreSelectFx({}),
		where,
		scope,
	});
});

export type ignoreCountFx = ReturnType<typeof ignoreCountFx>;
