import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { withDateServiceFx } from "@/lib/common/date";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { userRestrictionCollectionFx } from "~/user/user-restriction/server/fx/userRestrictionCollectionFx";
import { userRestrictionCountFx } from "~/user/user-restriction/server/fx/userRestrictionCountFx";
import { userRestrictionCreateFx } from "~/user/user-restriction/server/fx/userRestrictionCreateFx";
import { withUserRestrictionContextFx } from "~/user/user-restriction/server/fx/withUserRestrictionContextFx";

type TestDatabase = Awaited<ReturnType<typeof testabase>>;

const atFx = <A, E, R>(iso: string, eff: Effect.Effect<A, E, R>) =>
	eff.pipe(
		withDateServiceFx({
			now: () => DateTime.fromISO(iso),
		}),
	);

const withRestrictionRuntimeFx = (database: TestDatabase) => {
	return <A, E, R>(effect: Effect.Effect<A, E, R>) =>
		effect.pipe(
			withRuntimeFx(database),
			withUserRestrictionContextFx({
				delay: {
					adult: 0,
					sensitive: 2,
				},
			}),
		);
};

describe("userRestrictionCreateFx cooldown boundary", () => {
	it("keeps the current restriction active until the exact availableAt boundary and flips exactly on time", async () => {
		const database = await testabase("user-restriction-cooldown-boundary");

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
		}).pipe(withRestrictionRuntimeFx(database), Effect.runPromise);
	});
});
