import { Effect } from "effect";
import { DateContextFx } from "@/lib/common/date";
import { genId } from "@/lib/common/gen-id";
import { getLoggerFx } from "@/lib/common/log";
import type { FlagCreateSchema } from "~/buyer/flag/server/schema/FlagCreateSchema";
import { dbFx } from "~/server/database/fx/dbFx";

export namespace flagCreateFx {
	export interface Props extends FlagCreateSchema.Type {
		userId: string;
	}
}

export const flagCreateFx = Effect.fn("flagCreateFx")(function* ({
	userId,
	listingId,
}: flagCreateFx.Props) {
	const logger = yield* getLoggerFx("flagCreateFx");
	logger.trace("flagCreateFx", {
		userId,
		listingId,
	});

	const dateContext = yield* DateContextFx;

	const id = genId();

	return yield* dbFx(async (kysely) => {
		return kysely
			.insertInto("flag")
			.values({
				id,
				userId,
				listingId,
				createdAt: dateContext.now().toJSDate(),
			})
			.onConflict((eb) => eb.doNothing())
			.returningAll()
			.executeTakeFirstOrThrow();
	});
});

export type flagCreateFx = ReturnType<typeof flagCreateFx>;
