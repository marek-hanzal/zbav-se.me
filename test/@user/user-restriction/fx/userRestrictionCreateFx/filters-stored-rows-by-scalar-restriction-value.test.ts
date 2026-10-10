import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import type { RestrictionEnumSchema } from "~/restriction/schema/RestrictionEnumSchema";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { withUserRestrictionContextFn } from "~/user-restriction/fn/withUserRestrictionContextFn";
import { userRestrictionCollectionFx } from "~/user-restriction/fx/userRestrictionCollectionFx";
import { userRestrictionCreateFx } from "~/user-restriction/fx/userRestrictionCreateFx";
import type { UserRestrictionSchema } from "~/user-restriction/schema/UserRestrictionSchema";

type TestDatabase = Awaited<ReturnType<typeof testabaseFn>>;
type Restriction = RestrictionEnumSchema.Type;
type UserRestriction = UserRestrictionSchema.Type;
type StoredRestriction = {
	id: string;
	restriction: Restriction;
	availableAt: Date;
	expiresAt: Date | null;
	createdAt: Date;
};

const testDelay = {
	adult: 0,
	sensitive: 1,
	restricted: 2,
} satisfies Partial<Record<Restriction, number>>;

const withRestrictionRuntimeFn = (database: TestDatabase) => {
	return <A, E, R>(effect: Effect.Effect<A, E, R>) =>
		effect.pipe(
			withRuntimeFn(database),
			withUserRestrictionContextFn({
				delay: testDelay,
			}),
		);
};

const createRestrictionFx = (userId: string, restriction: Restriction) =>
	userRestrictionCreateFx({
		userId,
		restriction,
	});

const _fetchLiveRestrictionsFx = (userId: string) =>
	userRestrictionCollectionFx({
		scope: {
			userId,
		},
		where: {
			isExpired: false,
		},
		sort: [
			{
				field: "availableAt",
				order: "asc",
			},
			{
				field: "createdAt",
				order: "asc",
			},
		],
	});

const _fetchAvailableRestrictionsFx = (userId: string) =>
	userRestrictionCollectionFx({
		scope: {
			userId,
		},
		where: {
			isAvailable: true,
			isExpired: false,
		},
		sort: [
			{
				field: "availableAt",
				order: "asc",
			},
		],
	});

const _fetchWaitingRestrictionsFx = (userId: string) =>
	userRestrictionCollectionFx({
		scope: {
			userId,
		},
		where: {
			isAvailable: false,
			isExpired: false,
		},
		sort: [
			{
				field: "availableAt",
				order: "asc",
			},
		],
	});

const _fetchStoredRestrictionsFx = (database: TestDatabase, userId: string) =>
	Effect.promise(
		() =>
			database.kysely
				.selectFrom("user_restriction")
				.select([
					"id",
					"restriction",
					"availableAt",
					"expiresAt",
					"createdAt",
				])
				.where("userId", "=", userId)
				.orderBy("createdAt", "asc")
				.execute() as Promise<StoredRestriction[]>,
	);

const expectRestrictionsFn = (restrictions: UserRestriction[], expected: Restriction[]) => {
	expect(restrictions.map((restriction) => restriction.restriction)).toEqual(expected);
};

describe("userRestrictionCreateFx", () => {
	it("filters stored rows by scalar restriction value", async () => {
		const database = await testabaseFn("user-restriction-filter-by-value");

		return Effect.gen(function* () {
			const user = yield* leaseTestUserFx({});

			yield* createRestrictionFx(user.id, "adult");
			yield* createRestrictionFx(user.id, "adult-relaxed");

			const adultRestrictions = yield* userRestrictionCollectionFx({
				scope: {
					userId: user.id,
				},
				where: {
					restriction: "adult",
				},
			});

			expectRestrictionsFn(adultRestrictions, [
				"adult",
			]);
		}).pipe(withRestrictionRuntimeFn(database), Effect.runPromise);
	});
});
