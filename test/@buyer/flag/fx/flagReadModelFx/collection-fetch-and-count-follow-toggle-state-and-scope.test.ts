import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { flagCollectionFx } from "~/buyer/flag/server/fx/flagCollectionFx";
import { flagCountFx } from "~/buyer/flag/server/fx/flagCountFx";
import { flagFetchFx } from "~/buyer/flag/server/fx/flagFetchFx";
import { flagToggleFx } from "~/buyer/flag/server/fx/flagToggleFx";
import { auth } from "~/server/auth/auth";
import { testabase } from "~/test/testabase";
import { createListingFx } from "~/test/utils/createListingFx";
import { withRuntimeFx } from "~/test/utils/withRuntimeFx";

describe("flag read model", () => {
	it("collection, fetch and count reflect toggle state and respect scope", async () => {
		const database = await testabase("flagReadModelFx");
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

			const { user: seller } = yield* signUp("flag-read-seller@test.cz", "Flag Seller");
			const { user: buyer } = yield* signUp("flag-read-buyer@test.cz", "Flag Buyer");
			const { user: stranger } = yield* signUp("flag-read-stranger@test.cz", "Flag Stranger");

			const listing = yield* createListingFx(seller.id);

			yield* flagToggleFx({
				userId: buyer.id,
				listingId: listing.id,
				toggle: true,
			});

			const collection = yield* flagCollectionFx({
				scope: {
					userId: buyer.id,
				},
			});

			expect(collection).toHaveLength(1);

			const flagged = yield* flagFetchFx({
				scope: {
					userId: buyer.id,
				},
				where: {
					listingId: listing.id,
				},
			});

			expect(flagged.listingId).toBe(listing.id);

			const count = yield* flagCountFx({
				scope: {
					userId: buyer.id,
				},
			});

			expect(count.total).toBe(1);

			const strangerCollection = yield* flagCollectionFx({
				scope: {
					userId: stranger.id,
				},
			});

			expect(strangerCollection).toEqual([]);

			yield* flagToggleFx({
				userId: buyer.id,
				listingId: listing.id,
				toggle: false,
			});

			const afterCollection = yield* flagCollectionFx({
				scope: {
					userId: buyer.id,
				},
			});
			const afterCount = yield* flagCountFx({
				scope: {
					userId: buyer.id,
				},
			});
			const afterFetch = yield* Effect.either(
				flagFetchFx({
					scope: {
						userId: buyer.id,
					},
					where: {
						listingId: listing.id,
					},
				}),
			);

			expect(afterCollection).toEqual([]);
			expect(afterCount.total).toBe(0);
			expect(afterFetch._tag).toBe("Left");
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
