import { Effect } from "effect";
import type { withDatabaseFx } from "@/lib/common/database";
import type { Database } from "~/server/database/Database";

const TEST_USER_KEYS = [
	"a",
	"b",
	"c",
	"d",
	"e",
	"f",
	"g",
	"h",
	"i",
	"j",
	"k",
	"l",
	"m",
	"n",
	"o",
	"p",
	"q",
	"r",
	"s",
	"t",
	"u",
	"v",
	"w",
	"x",
	"y",
	"z",
] as const;

export namespace seedTestUsersFx {
	export interface Props {
		database: withDatabaseFx.Instance<Database>;
	}
}

export const seedTestUsersFx = Effect.fn("seedTestUsersFx")(function* ({
	database,
}: seedTestUsersFx.Props) {
	const now = new Date("2026-01-01T00:00:00.000Z");

	yield* Effect.promise(() =>
		database.kysely
			.insertInto("user")
			.values(
				TEST_USER_KEYS.map((key) => ({
					id: `user_test_${key}`,
					email: `test-${key}@test.cz`,
					name: `Test ${key.toUpperCase()}`,
					emailVerified: false,
					image: null,
					createdAt: now,
					updatedAt: now,
				})),
			)
			.onConflict((oc) => oc.column("email").doNothing())
			.execute(),
	);
});
