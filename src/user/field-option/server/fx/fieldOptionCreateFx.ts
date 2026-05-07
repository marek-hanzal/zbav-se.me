import { Effect } from "effect";
import { getLoggerFx } from "@/lib/common/log";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
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

	const { kysely } = yield* KyselyContextFx;

	return yield* tryDbFx(async () => {
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
