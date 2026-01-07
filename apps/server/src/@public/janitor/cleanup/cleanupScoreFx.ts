import { Effect } from "effect";
import { DateTime } from "luxon";
import type { CleanupSchema } from "~/@public/janitor/schema/CleanupSchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";

export const cleanupScoreFx = Effect.fn("cleanupScoreFx")(function* () {
	const { kysely } = yield* KyselyContextFx;

	const cutoffDate = DateTime.now()
		.minus({
			months: 1,
		})
		.toJSDate();

	const total = yield* Effect.promise(async () => {
		return kysely
			.selectFrom("listing_event")
			.select((eb) => eb.fn.count<number>("id").as("count"))
			.executeTakeFirstOrThrow();
	});

	const result = yield* Effect.promise(async () => {
		return kysely
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
