import { Effect } from "effect";
import { DateTime } from "luxon";
import type { CleanupSchema } from "~/@public/janitor/schema/CleanupSchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { tryDbFx } from "~/database/fx/tryDbFx";

const terminalStatuses = [
	"rejected",
	"expired",
	"success",
	"closed",
] as const;

export const cleanupTransactionFx = Effect.fn("cleanupTransactionFx")(function* () {
	const { kysely } = yield* KyselyContextFx;
	const threshold = DateTime.now()
		.minus({
			months: 3,
		})
		.toJSDate();

	const candidates = yield* tryDbFx(async () =>
		kysely
			.selectFrom("transaction as t")
			.innerJoinLateral(
				(eb) =>
					eb
						.selectFrom("transaction_status as ts")
						.select([
							"ts.status",
							"ts.createdAt",
						])
						.whereRef("ts.transactionId", "=", "t.id")
						.orderBy("ts.createdAt", "desc")
						.orderBy("ts.id", "desc")
						.limit(1)
						.as("latest_status"),
				(join) => join.onTrue(),
			)
			.select("t.id")
			.where("latest_status.status", "in", terminalStatuses)
			.where("latest_status.createdAt", "<=", threshold)
			.execute(),
	);

	let deleted = 0;

	for (const candidate of candidates) {
		yield* tryDbFx(async () =>
			kysely.deleteFrom("transaction").where("id", "=", candidate.id).executeTakeFirst(),
		);
		deleted++;
	}

	return {
		type: "transaction",
		total: candidates.length,
		deleted,
	} satisfies CleanupSchema.Type;
});
