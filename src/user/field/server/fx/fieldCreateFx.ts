import { Effect } from "effect";
import { getLoggerFx } from "@/lib/common/log";
import { dbFx } from "~/server/database/fx/dbFx";
import type { FieldCreateSchema } from "../schema/FieldCreateSchema";
import { fieldFetchFx } from "./fieldFetchFx";

export namespace fieldCreateFx {
	export interface Props extends FieldCreateSchema.Type {
		//
	}
}

export const fieldCreateFx = Effect.fn("fieldCreateFx")(function* (data: fieldCreateFx.Props) {
	const logger = yield* getLoggerFx("fieldCreateFx");
	logger.trace("fieldCreateFx", {
		...data,
	});

	yield* dbFx(async (kysely) => {
		return kysely.insertInto("field").values(data).returningAll().executeTakeFirstOrThrow();
	});

	return yield* fieldFetchFx({
		where: {
			name: data.name,
		},
		scope: {},
	});
});

export type fieldCreateFx = ReturnType<typeof fieldCreateFx>;
