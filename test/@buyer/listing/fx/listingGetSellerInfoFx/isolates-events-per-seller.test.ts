import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { DateContextFx } from "@/lib/common/date";
import { listingGetSellerInfoFx } from "~/buyer/listing/server/fx/listingGetSellerInfoFx";
import { auth } from "~/server/auth/auth";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { testabase } from "~/test/testabase";
import { userEventCreateFx } from "~/user/user-event/server/fx/userEventCreateFx";

describe("listingGetSellerInfoFx", () => {
	it("returns seller events only for the seller behind the requested listing", async () => {
		const database = await testabase("listingGetSellerInfoFx-event-isolation");
		const { api } = auth(() => database.dialect);

		return Effect.gen(function* () {
			const signUp = (email: string, name: string) =>
				Effect.promise(() =>
					api.signUpEmail({
						body: {
							email,
							name,
							password: "12345678",
						},
					}),
				);

			const { user: sellerA } = yield* signUp("seller-info-a@test.cz", "Seller Info A");
			const { user: sellerB } = yield* signUp("seller-info-b@test.cz", "Seller Info B");

			const listingA = yield* createListingFx(sellerA.id);
			const listingB = yield* createListingFx(sellerB.id);

			yield* userEventCreateFx({
				userId: sellerA.id,
				scope: "foreign",
				source: "transaction",
				group: "listing-seller-a",
				event: "transaction.create",
				isTerminal: false,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now: () =>
						DateTime.now().minus({
							days: 10,
						}),
				}),
			);
			yield* userEventCreateFx({
				userId: sellerA.id,
				scope: "user",
				source: "transaction",
				group: "listing-seller-a",
				event: "transaction.open",
				isTerminal: false,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now: () =>
						DateTime.now().minus({
							days: 9,
						}),
				}),
			);

			yield* userEventCreateFx({
				userId: sellerB.id,
				scope: "foreign",
				source: "transaction",
				group: "listing-seller-b",
				event: "transaction.create",
				isTerminal: false,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now: () =>
						DateTime.now().minus({
							days: 8,
						}),
				}),
			);

			const sellerAInfo = yield* listingGetSellerInfoFx({
				listingId: listingA.id,
			});
			const sellerBInfo = yield* listingGetSellerInfoFx({
				listingId: listingB.id,
			});

			expect(sellerAInfo.events).not.toBeNull();
			expect(sellerAInfo.events?.reaction.total).toBe(1);
			expect(sellerBInfo.events).toBeNull();
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
