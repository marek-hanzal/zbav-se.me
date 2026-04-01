import { Effect } from "effect";
import { sql } from "kysely";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";

export const SeedPrimaryCoreTables = [
	"user",
	"user_ex",
	"location",
	"upload",
	"gallery",
	"gallery_item",
	"draft",
	"listing",
	"feed",
] as const;

export const SeedPrimaryInteractionTables = [
	"transaction",
	"transaction_entry",
	"transaction_user",
	"thumb",
	"favourite",
	"ignore",
	"flag",
	"listing_event",
	"user_event",
] as const;

export const withSeedTableCountsFx = Effect.fn("withSeedTableCountsFx")(function* ({
	tables,
}: {
	tables: readonly string[];
}) {
	const { kysely } = yield* KyselyContextFx;
	const result: Record<string, number> = {};

	for (const table of tables) {
		const { total } = yield* tryDbFx(async () =>
			kysely
				.selectFrom(table as any)
				.select(sql<number>`count(*)::int`.as("total"))
				.executeTakeFirstOrThrow(),
		);
		result[table] = total ?? 0;
	}

	return result;
});

export type withSeedTableCountsFx = ReturnType<typeof withSeedTableCountsFx>;
