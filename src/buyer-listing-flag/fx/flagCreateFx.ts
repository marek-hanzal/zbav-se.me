import { Effect } from "effect";
import type { FlagCreateSchema } from "~/buyer-listing-flag/schema/FlagCreateSchema";
import { dbFx } from "~/database/fx/dbFx";
import { DateServiceFx } from "~/date/service/DateServiceFx";
import { genIdFn } from "~/identity/fn/genIdFn";
import { getLoggerFx } from "~/log/fx/getLoggerFx";

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

	const dateContext = yield* DateServiceFx;

	const id = genIdFn();

	return yield* dbFx(async (kysely) => {
		return kysely
			.insertInto("listing_flag")
			.values({
				id,
				userId,
				listingId,
				createdAt: dateContext.nowFn().toJSDate(),
			})
			.onConflict((eb) => eb.doNothing())
			.returningAll()
			.executeTakeFirstOrThrow();
	});
});

export type flagCreateFx = ReturnType<typeof flagCreateFx>;
