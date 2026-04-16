import { Effect } from "effect";
import { DateContextFx } from "@/lib/common/date";
import { genId } from "@/lib/common/gen-id";
import { getLoggerFx } from "@/lib/common/log";
import type { IgnoreCreateSchema } from "~/buyer/ignore/server/schema/IgnoreCreateSchema";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";

export namespace ignoreCreateFx {
	export interface Props extends IgnoreCreateSchema.Type {
		userId: string;
	}
}

export const ignoreCreateFx = Effect.fn("ignoreCreateFx")(function* ({
	userId,
	listingId,
}: ignoreCreateFx.Props) {
	const logger = yield* getLoggerFx("ignoreCreateFx");
	logger.trace("ignoreCreateFx", {
		userId,
		listingId,
	});

	const { kysely } = yield* KyselyContextFx;
	const dateContext = yield* DateContextFx;

	const id = genId();

	return yield* tryDbFx(async () =>
		kysely
			.insertInto("ignore")
			.values({
				id,
				userId,
				listingId,
				createdAt: dateContext.now().toJSDate(),
			})
			.onConflict((eb) => eb.doNothing())
			.returningAll()
			.executeTakeFirstOrThrow(),
	);
});

export type ignoreCreateFx = ReturnType<typeof ignoreCreateFx>;
