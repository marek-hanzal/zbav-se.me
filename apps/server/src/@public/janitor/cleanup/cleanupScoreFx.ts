import { DateContextFx } from "@use-pico/common/date";
import { Effect } from "effect";
import type { CleanupSchema } from "~/@public/janitor/schema/CleanupSchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { tryDbFx } from "~/database/fx/tryDbFx";

export const cleanupScoreFx = Effect.fn("cleanupScoreFx")(function* () {
	const { kysely } = yield* KyselyContextFx;
	const dateContext = yield* DateContextFx;

	const cutoffDate = dateContext
		.now()
		.minus({
			months: 1,
		})
		.toJSDate();

	const total = yield* tryDbFx(async () =>
		kysely
			.selectFrom("listing_event")
			.select((eb) => eb.fn.count<number>("id").as("count"))
			.executeTakeFirstOrThrow(),
	);

	const result = yield* tryDbFx(async () =>
		kysely.deleteFrom("listing_event").where("createdAt", "<", cutoffDate).executeTakeFirst(),
	);

	return {
		type: "listing-event",
		total: Number(total.count),
		deleted: Number(result.numDeletedRows),
	} satisfies CleanupSchema.Type;
});
