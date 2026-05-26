import { Effect } from "effect";
import type { withDatabaseFx } from "@/lib/common/database";
import { translator } from "@/lib/common/translation";
import { auth } from "~/server/auth/auth";
import type { Database } from "~/server/database/Database";
import { TEST_USER_PASSWORD, toLeasedTestUserEmail } from "~/test/user/fx/leaseTestUserFx";

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
	const seedTranslator = translator({
		translations: [],
	});
	const { api } = auth({
		dialect: () => database.dialect,
		translator: seedTranslator,
	});

	yield* Effect.forEach(TEST_USER_KEYS, (key) =>
		Effect.tryPromise({
			try: async () => {
				await api.signUpEmail({
					body: {
						email: toLeasedTestUserEmail(key),
						name: `Test ${key.toUpperCase()}`,
						password: TEST_USER_PASSWORD,
					},
				});
			},
			catch: (cause) => cause,
		}),
	);
});
