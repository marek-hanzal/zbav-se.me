import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { withDateServiceFn } from "~/date/fn/withDateServiceFn";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { withUserRestrictionContextFn } from "~/user-restriction/fn/withUserRestrictionContextFn";
import { userRestrictionCollectionFx } from "~/user-restriction/fx/userRestrictionCollectionFx";
import { userRestrictionCountFx } from "~/user-restriction/fx/userRestrictionCountFx";
import { userRestrictionCreateFx } from "~/user-restriction/fx/userRestrictionCreateFx";

type TestDatabase = Awaited<ReturnType<typeof testabaseFn>>;

const atFx = <A, E, R>(iso: string, eff: Effect.Effect<A, E, R>) =>
	eff.pipe(
		withDateServiceFn({
			nowFn: () => DateTime.fromISO(iso),
		}),
	);

const withRestrictionRuntimeFn = (database: TestDatabase) => {
	return <A, E, R>(effect: Effect.Effect<A, E, R>) =>
		effect.pipe(
			withRuntimeFn(database),
			withUserRestrictionContextFn({
				delay: {
					adult: 0,
					sensitive: 2,
				},
			}),
		);
};

describe("userRestrictionCreateFx cooldown boundary", () => {
	it("keeps the current restriction active until the exact availableAt boundary and flips exactly on time", async () => {
		const database = await testabaseFn("user-restriction-cooldown-boundary");

		return Effect.gen(function* () {
			const user = yield* leaseTestUserFx({});

			yield* atFx(
				"2026-04-25T10:00:00.000Z",
				userRestrictionCreateFx({
					userId: user.id,
					restriction: "adult",
				}),
			);
			const waiting = yield* atFx(
				"2026-04-25T10:05:00.000Z",
				userRestrictionCreateFx({
					userId: user.id,
					restriction: "sensitive",
				}),
			);

			const beforeBoundaryLive = yield* atFx(
				"2026-04-25T12:04:59.999Z",
				userRestrictionCollectionFx({
					scope: {
						userId: user.id,
					},
					where: {
						isExpired: false,
					},
					sort: [
						{
							field: "availableAt",
							order: "asc",
						},
					],
				}),
			);
			const beforeBoundaryAvailableCount = yield* atFx(
				"2026-04-25T12:04:59.999Z",
				userRestrictionCountFx({
					scope: {
						userId: user.id,
					},
					where: {
						isAvailable: true,
						isExpired: false,
					},
				}),
			);
			const atBoundaryAvailable = yield* atFx(
				waiting.availableAt.toISOString(),
				userRestrictionCollectionFx({
					scope: {
						userId: user.id,
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
				}),
			);
			const atBoundaryWaitingCount = yield* atFx(
				waiting.availableAt.toISOString(),
				userRestrictionCountFx({
					scope: {
						userId: user.id,
					},
					where: {
						isAvailable: false,
						isExpired: false,
					},
				}),
			);

			expect(beforeBoundaryLive.map((item) => item.restriction)).toEqual([
				"adult",
				"sensitive",
			]);
			expect(beforeBoundaryLive.map((item) => item.isAvailable)).toEqual([
				true,
				false,
			]);
			expect(beforeBoundaryAvailableCount).toBe(1);

			expect(atBoundaryAvailable.map((item) => item.restriction)).toEqual([
				"sensitive",
			]);
			expect(atBoundaryAvailable[0]?.isAvailable).toBe(true);
			expect(atBoundaryWaitingCount).toBe(0);
		}).pipe(withRestrictionRuntimeFn(database), Effect.runPromise);
	});
});
