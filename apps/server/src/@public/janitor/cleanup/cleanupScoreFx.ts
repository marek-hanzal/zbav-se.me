import { Effect } from "effect";
import { DateTime } from "luxon";
import type { CleanupSchema } from "~/@public/janitor/schema/CleanupSchema";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";

export const cleanupScoreFx = Effect.fn("cleanupScoreFx")(function* () {
	const database = yield* DatabaseContextFx;

	const cutoffDate = DateTime.now()
		.minus({
			months: 1,
		})
		.toJSDate();

	const total = yield* Effect.promise(async () => {
		return database
			.selectFrom("listing_event")
			.select((eb) => eb.fn.count<number>("id").as("count"))
			.executeTakeFirstOrThrow();
	});

	const result = yield* Effect.promise(async () => {
		return database
			.deleteFrom("listing_event")
			.where("createdAt", "<", cutoffDate)
			.executeTakeFirst();
	});

	return {
		type: "listing-event",
		total: Number(total.count),
		deleted: Number(result.numDeletedRows),
	} satisfies CleanupSchema.Type;
});
