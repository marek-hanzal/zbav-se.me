import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { withDateServiceFx } from "@/lib/common/date";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { userRestrictionCountFx } from "~/user/user-restriction/server/fx/userRestrictionCountFx";
import { userRestrictionFetchFx } from "~/user/user-restriction/server/fx/userRestrictionFetchFx";

const atFx = <A, E, R>(iso: string, eff: Effect.Effect<A, E, R>) =>
	eff.pipe(
		withDateServiceFx({
			now: () => DateTime.fromISO(iso),
		}),
	);

describe("userRestriction read model fx", () => {
	it("fetches and counts only scoped rows while distinguishing available, waiting, and expired restrictions", async () => {
		const database = await testabase("user-restriction-read-model-fetch-count");

		return Effect.gen(function* () {
			const { seller, buyer } = yield* createUsersFx({});

			yield* Effect.promise(() =>
				database.kysely
					.insertInto("user_restriction")
					.values([
						{
							id: "seller-live",
							userId: seller.id,
							restriction: "adult",
							availableAt: new Date("2026-04-20T09:00:00.000Z"),
							expiresAt: null,
							createdAt: new Date("2026-04-20T09:00:00.000Z"),
						},
						{
							id: "seller-waiting",
							userId: seller.id,
							restriction: "sensitive",
							availableAt: new Date("2026-04-20T13:00:00.000Z"),
							expiresAt: null,
							createdAt: new Date("2026-04-20T10:00:00.000Z"),
						},
						{
							id: "seller-expired",
							userId: seller.id,
							restriction: "restricted",
							availableAt: new Date("2026-04-20T07:00:00.000Z"),
							expiresAt: new Date("2026-04-20T11:00:00.000Z"),
							createdAt: new Date("2026-04-20T07:00:00.000Z"),
						},
						{
							id: "buyer-live",
							userId: buyer.id,
							restriction: "adult-relaxed",
							availableAt: new Date("2026-04-20T08:00:00.000Z"),
							expiresAt: null,
							createdAt: new Date("2026-04-20T08:00:00.000Z"),
						},
					])
					.execute(),
			);

			const live = yield* atFx(
				"2026-04-20T12:00:00.000Z",
				userRestrictionFetchFx({
					scope: {
						userId: seller.id,
					},
					where: {
						id: "seller-live",
						isAvailable: true,
						isExpired: false,
					},
				}),
			);
			const waitingCount = yield* atFx(
				"2026-04-20T12:00:00.000Z",
				userRestrictionCountFx({
					scope: {
						userId: seller.id,
					},
					where: {
						isAvailable: false,
						isExpired: false,
					},
				}),
			);
			const expiredCount = yield* atFx(
				"2026-04-20T12:00:00.000Z",
				userRestrictionCountFx({
					scope: {
						userId: seller.id,
					},
					where: {
						isExpired: true,
					},
				}),
			);
			const buyerLiveCount = yield* atFx(
				"2026-04-20T12:00:00.000Z",
				userRestrictionCountFx({
					scope: {
						userId: buyer.id,
					},
					where: {
						isAvailable: true,
						isExpired: false,
					},
				}),
			);

			expect(live.id).toBe("seller-live");
			expect(live.isAvailable).toBe(true);
			expect(waitingCount).toBe(1);
			expect(expiredCount).toBe(1);
			expect(buyerLiveCount).toBe(1);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
