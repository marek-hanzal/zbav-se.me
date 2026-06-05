import { Effect } from "effect";
import { DateServiceFx } from "@/lib/common/date";
import { genId } from "@/lib/common/gen-id";
import { getLoggerFx } from "@/lib/common/log";
import type { IgnoreCreateSchema } from "~/buyer/listing-ignore/server/schema/IgnoreCreateSchema";
import { dbFx } from "~/server/database/fx/dbFx";

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
