import { Effect } from "effect";
import { withIgnoreSelectFx } from "~/buyer-listing-ignore/db/withIgnoreSelectFx";
import type { IgnoreCountQuerySchema } from "~/buyer-listing-ignore/schema/IgnoreCountQuerySchema";
import type { IgnoreWhereSchema } from "~/buyer-listing-ignore/schema/IgnoreWhereSchema";
import { withCountFx } from "~/database-query/fx/withCountFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";

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
