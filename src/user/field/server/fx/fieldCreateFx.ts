import { Effect } from "effect";
import { genId } from "@/lib/common/gen-id";
import { getLoggerFx } from "@/lib/common/log";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
import type { FieldCreateSchema } from "../schema/FieldCreateSchema";

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

	const { kysely } = yield* KyselyContextFx;

	return yield* tryDbFx(async () => {
		return kysely
			.insertInto("field")
			.values({
				...data,
				id: genId(),
			})
			.returningAll()
			.executeTakeFirstOrThrow();
	});
});

export type fieldCreateFx = ReturnType<typeof fieldCreateFx>;
