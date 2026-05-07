import { Effect } from "effect";
import { withCountFx } from "@/lib/common/count";
import { getLoggerFx } from "@/lib/common/log";
import { withFlagSelectFx } from "~/buyer/flag/server/db/withFlagSelectFx";
import type { FlagCountQuerySchema } from "~/buyer/flag/server/schema/FlagCountQuerySchema";
import type { FlagFilterSchema } from "~/buyer/flag/server/schema/FlagFilterSchema";

export namespace flagCountFx {
	export interface Props extends FlagCountQuerySchema.Type {
		scope: FlagFilterSchema.Type;
	}
}

export const flagCountFx = Effect.fn("flagCountFx")(function* ({
	filter,
	where,
	scope,
}: flagCountFx.Props) {
	const logger = yield* getLoggerFx("flagCountFx");
	logger.trace("flagCountFx", {
		filter,
		where,
		scope,
	});

	return yield* withCountFx({
		selectFx: withFlagSelectFx({}),
		filter,
		where,
		scope,
	});
});

export type flagCountFx = ReturnType<typeof flagCountFx>;
