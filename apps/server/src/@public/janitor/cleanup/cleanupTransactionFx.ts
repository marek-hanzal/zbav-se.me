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
			.select("t.id")
			.where("t.status", "in", terminalStatuses)
			.where("t.statusUpdatedAt", "<=", threshold)
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
