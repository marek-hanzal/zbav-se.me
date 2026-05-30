import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import type { RestrictionEnumSchema } from "~/common/restriction/enum/RestrictionEnumSchema";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { userRestrictionCollectionFx } from "~/user/user-restriction/server/fx/userRestrictionCollectionFx";
import { userRestrictionCreateFx } from "~/user/user-restriction/server/fx/userRestrictionCreateFx";
import { withUserRestrictionContextFx } from "~/user/user-restriction/server/fx/withUserRestrictionContextFx";
import type { UserRestrictionSchema } from "~/user/user-restriction/server/schema/UserRestrictionSchema";

type TestDatabase = Awaited<ReturnType<typeof testabase>>;
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

const withRestrictionRuntimeFx = (database: TestDatabase) => {
	return <A, E, R>(effect: Effect.Effect<A, E, R>) =>
		effect.pipe(
			withRuntimeFx(database),
			withUserRestrictionContextFx({
				delay: testDelay,
			}),
		);
};

const createRestriction = (userId: string, restriction: Restriction) =>
	userRestrictionCreateFx({
		userId,
		restriction,
	});

const fetchLiveRestrictions = (userId: string) =>
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

const fetchAvailableRestrictions = (userId: string) =>
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

const fetchWaitingRestrictions = (userId: string) =>
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

const _fetchStoredRestrictions = (database: TestDatabase, userId: string) =>
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

const expectRestrictions = (restrictions: UserRestriction[], expected: Restriction[]) => {
	expect(restrictions.map((restriction) => restriction.restriction)).toEqual(expected);
};

describe("userRestrictionCreateFx", () => {
	it("keeps exactly current and waiting restriction while delayed switch waits", async () => {
		const database = await testabase("user-restriction-create-waiting");

		return Effect.gen(function* () {
			const user = yield* leaseTestUserFx({});

			yield* createRestriction(user.id, "adult");
			yield* createRestriction(user.id, "sensitive");

			const liveRestrictions = yield* fetchLiveRestrictions(user.id);
			const availableRestrictions = yield* fetchAvailableRestrictions(user.id);
			const waitingRestrictions = yield* fetchWaitingRestrictions(user.id);

			expectRestrictions(liveRestrictions, [
				"adult",
				"sensitive",
			]);
			expectRestrictions(availableRestrictions, [
				"adult",
			]);
			expectRestrictions(waitingRestrictions, [
				"sensitive",
			]);
			expect(liveRestrictions).toHaveLength(2);
			expect(liveRestrictions[0]?.expiresAt?.getTime()).toBe(
				liveRestrictions[1]?.availableAt.getTime(),
			);
		}).pipe(withRestrictionRuntimeFx(database), Effect.runPromise);
	});
});
