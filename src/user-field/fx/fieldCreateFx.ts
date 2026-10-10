import { Effect } from "effect";
import { dbFx } from "~/database/fx/dbFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import { fieldFetchFx } from "~/user-field/fx/fieldFetchFx";
import type { FieldCreateSchema } from "~/user-field/schema/FieldCreateSchema";

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
