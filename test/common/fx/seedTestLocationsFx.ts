import { Effect } from "effect";
import { sql } from "kysely";
import type { withDatabaseFx } from "@/lib/common/database";
import type { Database } from "~/server/database/Database";

export namespace seedTestLocationsFx {
	export interface Props {
		database: withDatabaseFx.Instance<Database>;
	}
}

export const seedTestLocationsFx = Effect.fn("seedTestLocationsFx")(function* ({
	database,
}: seedTestLocationsFx.Props) {
	yield* Effect.promise(() =>
		database.kysely
			.insertInto("location")
			.values([
				{
					id: "loc_test_praha",
					query: "Praha",
					lang: "cs",
					country: "Cesko",
					code: "CZ",
					county: "Hlavni mesto Praha",
					municipality: "Praha",
					state: "Hlavni mesto Praha",
					address: "Praha, Cesko",
					city: "Praha",
					street: null,
					zip: "110 00",
					confidence: 0.99,
					hash: "test:praha:cs",
					lat: 50.075539,
					lon: 14.4378,
					geo: sql`default`,
				},
			])
			.onConflict((oc) =>
				oc
					.columns([
						"lang",
						"hash",
					])
					.doNothing(),
			)
			.execute(),
	);
});
