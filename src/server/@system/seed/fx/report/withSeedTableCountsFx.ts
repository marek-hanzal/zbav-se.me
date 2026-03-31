import { Effect } from "effect";
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
				.select((eb) => eb.fn.countAll<number>().as("total"))
				.executeTakeFirstOrThrow(),
		);
		result[table] = Number(total ?? 0);
	}

	return result;
});

export type withSeedTableCountsFx = ReturnType<typeof withSeedTableCountsFx>;
