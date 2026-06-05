import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { DateServiceFx } from "@/lib/common/date";
import { withCronFx } from "~/common/@cron/server/withCronFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

const atFx = <A, E, R>(iso: string, eff: Effect.Effect<A, E, R>) =>
	eff.pipe(
		Effect.provideService(DateServiceFx, {
			now: () =>
				DateTime.fromISO(iso, {
					setZone: true,
				}),
		}),
	);

describe("withCronFx hourly", () => {
	it("expires only live listings whose expiresAt is at or before the current time", async () => {
		const database = await testabase("withCronFx-hourly-expire-listings");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});

			const overdueListing = yield* createListingFx(seller.id, {
				title: "Overdue live listing",
			});
			const boundaryListing = yield* createListingFx(seller.id, {
				title: "Boundary live listing",
			});
			const futureListing = yield* createListingFx(seller.id, {
				title: "Future live listing",
			});
			const alreadyExpiredListing = yield* createListingFx(seller.id, {
				title: "Already expired listing",
			});

			yield* Effect.promise(() =>
				database.kysely
					.updateTable("listing")
					.set({
						expiresAt: new Date("2026-05-10T09:59:59.000Z"),
					})
					.where("id", "=", overdueListing.id)
					.execute(),
			);

			yield* Effect.promise(() =>
				database.kysely
					.updateTable("listing")
					.set({
						expiresAt: new Date("2026-05-10T10:00:00.000Z"),
					})
					.where("id", "=", boundaryListing.id)
					.execute(),
			);

			yield* Effect.promise(() =>
				database.kysely
					.updateTable("listing")
					.set({
						expiresAt: new Date("2026-05-10T10:00:01.000Z"),
					})
					.where("id", "=", futureListing.id)
					.execute(),
			);

			yield* Effect.promise(() =>
				database.kysely
					.updateTable("listing")
					.set({
						status: "expired",
						expiresAt: new Date("2026-05-09T10:00:00.000Z"),
					})
					.where("id", "=", alreadyExpiredListing.id)
					.execute(),
			);

			yield* atFx(
				"2026-05-10T10:00:00.000Z",
				withCronFx({
					schedule: "hourly",
				}),
			);

			const listings = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("listing")
					.select([
						"id",
						"status",
					])
					.where("id", "in", [
						overdueListing.id,
						boundaryListing.id,
						futureListing.id,
						alreadyExpiredListing.id,
					])
					.orderBy("id", "asc")
					.execute(),
			);

			expect(listings).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						id: overdueListing.id,
						status: "expired",
					}),
					expect.objectContaining({
						id: boundaryListing.id,
						status: "expired",
					}),
					expect.objectContaining({
						id: futureListing.id,
						status: "live",
					}),
					expect.objectContaining({
						id: alreadyExpiredListing.id,
						status: "expired",
					}),
				]),
			);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
