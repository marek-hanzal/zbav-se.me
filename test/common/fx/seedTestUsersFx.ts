import { Effect } from "effect";
import type { withDatabaseFx } from "@/lib/common/database";
import { genId } from "@/lib/common/gen-id";
import { translator } from "@/lib/common/translation";
import type { ResourceDefinitionEnumSchema } from "~/common/resource-definition/enum/ResourceDefinitionEnumSchema";
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

type TestUserKey = (typeof TEST_USER_KEYS)[number];
type TestUserLimit = {
	resourceDefinitionId: ResourceDefinitionEnumSchema.Type;
	limit: number;
};

const TEST_USER_LIMITS: TestUserLimit[] = [
	{
		resourceDefinitionId: "listing.count",
		limit: 100,
	},
	{
		resourceDefinitionId: "feed.count",
		limit: 100,
	},
	{
		resourceDefinitionId: "listing.gallery.count",
		limit: 24,
	},
];

export namespace seedTestUsersFx {
	export interface Props {
		database: withDatabaseFx.Instance<Database>;
	}
}

const toSeededTestUserLimitRows = (users: Database["user"][]) => {
	const now = new Date();

	return users.flatMap((user) =>
		TEST_USER_LIMITS.map((limit) => ({
			id: genId(),
			userId: user.id,
			resourceDefinitionId: limit.resourceDefinitionId,
			reference: null,
			createdAt: now,
			availableAt: now,
			expiresAt: null,
			limit: limit.limit,
		})),
	);
};

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

	yield* Effect.forEach(TEST_USER_KEYS, (key: TestUserKey) =>
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

	yield* Effect.promise(async () => {
		const users = await database.kysely
			.selectFrom("user")
			.selectAll()
			.where(
				"email",
				"in",
				TEST_USER_KEYS.map((key) => toLeasedTestUserEmail(key)),
			)
			.execute();

		await database.kysely
			.insertInto("user_resource_limit")
			.values(toSeededTestUserLimitRows(users))
			.execute();
	});
});
