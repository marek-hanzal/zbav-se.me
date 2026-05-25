import { Effect } from "effect";
import { getLoggerFx } from "@/lib/common/log";
import { dbFx } from "~/server/database/fx/dbFx";
import type { FieldOptionCreateSchema } from "../schema/FieldOptionCreateSchema";

export namespace fieldOptionCreateFx {
	export interface Props extends FieldOptionCreateSchema.Type {
		//
	}
}

export const fieldOptionCreateFx = Effect.fn("fieldOptionCreateFx")(function* (
	data: fieldOptionCreateFx.Props,
) {
	const logger = yield* getLoggerFx("fieldOptionCreateFx");
	logger.trace("fieldOptionCreateFx", {
		...data,
	});

	return yield* dbFx(async (kysely) => {
		return kysely
			.insertInto("field_option")
			.values({
				...data,
			})
			.returningAll()
			.executeTakeFirstOrThrow();
	});
});

export type fieldOptionCreateFx = ReturnType<typeof fieldOptionCreateFx>;
