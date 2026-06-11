import { Effect } from "effect";
import type { withDatabaseFx } from "@/lib/common/database";
import { genId } from "@/lib/common/gen-id";
import { translator } from "@/lib/common/translation";
import { auth } from "~/server/auth/auth";
import type { Database } from "~/server/database/Database";
import { TEST_USER_PASSWORD, toLeasedTestUserEmail } from "~/test/user/fx/leaseTestUserFx";
import { ResourceBundleEnumSchema } from "~/user/resource-bundle/server/schema/ResourceBundleEnumSchema";

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
const TEST_USER_RESOURCE_BUNDLE_AVAILABLE_AT = new Date("2020-01-01T00:00:00.000Z");

export namespace seedTestUsersFx {
	export interface Props {
		database: withDatabaseFx.Instance<Database>;
	}
}

const toSeededTestUserResourceBundleRows = (
	users: Database["user"][],
	resourceBundleId: string,
) => {
	return users.map((user) => ({
		id: genId(),
		userId: user.id,
		resourceBundleId,
		createdAt: TEST_USER_RESOURCE_BUNDLE_AVAILABLE_AT,
		availableAt: TEST_USER_RESOURCE_BUNDLE_AVAILABLE_AT,
		expiresAt: null,
	}));
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

		const resourceBundle = await database.kysely
			.selectFrom("resource_bundle")
			.select("id")
			.where("name", "=", ResourceBundleEnumSchema.enum["welcome:founders:promo"])
			.executeTakeFirstOrThrow();

		await database.kysely
			.insertInto("user_resource_bundle")
			.values(toSeededTestUserResourceBundleRows(users, resourceBundle.id))
			.onConflict((oc) =>
				oc
					.columns([
						"userId",
						"resourceBundleId",
					])
					.doNothing(),
			)
			.execute();

		const [items, limits, features, assignments] = await Promise.all([
			database.kysely
				.selectFrom("resource_bundle_item")
				.selectAll()
				.where("resourceBundleId", "=", resourceBundle.id)
				.execute(),
			database.kysely
				.selectFrom("resource_bundle_limit")
				.selectAll()
				.where("resourceBundleId", "=", resourceBundle.id)
				.execute(),
			database.kysely
				.selectFrom("resource_bundle_feature")
				.selectAll()
				.where("resourceBundleId", "=", resourceBundle.id)
				.execute(),
			database.kysely
				.selectFrom("user_resource_bundle")
				.select([
					"id",
				])
				.where(
					"userId",
					"in",
					users.map((user) => user.id),
				)
				.where("resourceBundleId", "=", resourceBundle.id)
				.execute(),
		]);

		for (const assignment of assignments) {
			const existingSnapshot = await database.kysely
				.selectFrom("user_resource_bundle_item")
				.select([
					"id",
				])
				.where("userResourceBundleId", "=", assignment.id)
				.executeTakeFirst();

			if (existingSnapshot) {
				continue;
			}

			for (const item of items) {
				await database.kysely
					.insertInto("user_resource_bundle_item")
					.values({
						id: genId(),
						userResourceBundleId: assignment.id,
						resourceDefinitionId: item.resourceDefinitionId,
						amount: item.amount,
						createdAt: TEST_USER_RESOURCE_BUNDLE_AVAILABLE_AT,
						availableAt: TEST_USER_RESOURCE_BUNDLE_AVAILABLE_AT,
						expiresAt: null,
					})
					.execute();
			}

			for (const limit of limits) {
				await database.kysely
					.insertInto("user_resource_bundle_limit")
					.values({
						id: genId(),
						userResourceBundleId: assignment.id,
						resourceDefinitionId: limit.resourceDefinitionId,
						limit: limit.limit,
						createdAt: TEST_USER_RESOURCE_BUNDLE_AVAILABLE_AT,
						availableAt: TEST_USER_RESOURCE_BUNDLE_AVAILABLE_AT,
						expiresAt: null,
					})
					.execute();
			}

			for (const feature of features) {
				await database.kysely
					.insertInto("user_resource_bundle_feature")
					.values({
						id: genId(),
						userResourceBundleId: assignment.id,
						resourceDefinitionId: feature.resourceDefinitionId,
						createdAt: TEST_USER_RESOURCE_BUNDLE_AVAILABLE_AT,
						availableAt: TEST_USER_RESOURCE_BUNDLE_AVAILABLE_AT,
						expiresAt: null,
					})
					.execute();
			}
		}
	});
});
