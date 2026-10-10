import { Effect } from "effect";
import type { IgnoreCreateSchema } from "~/buyer-listing-ignore/schema/IgnoreCreateSchema";
import { dbFx } from "~/database/fx/dbFx";
import { DateServiceFx } from "~/date/service/DateServiceFx";
import { genId } from "~/identity/fn/genId";
import { getLoggerFx } from "~/log/fx/getLoggerFx";

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

	const dateContext = yield* DateServiceFx;

	const id = genId();

	return yield* dbFx(async (kysely) => {
		return kysely
			.insertInto("listing_ignore")
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

export type ignoreCreateFx = ReturnType<typeof ignoreCreateFx>;
