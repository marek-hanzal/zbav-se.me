import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { ignoreCollectionFx } from "~/buyer/ignore/server/fx/ignoreCollectionFx";
import { ignoreCountFx } from "~/buyer/ignore/server/fx/ignoreCountFx";
import { ignoreFetchFx } from "~/buyer/ignore/server/fx/ignoreFetchFx";
import { ignoreToggleFx } from "~/buyer/ignore/server/fx/ignoreToggleFx";
import { auth } from "~/server/auth/auth";
import { testabase } from "~/test/testabase";
import { createListingFx } from "~/test/utils/createListingFx";
import { withRuntimeFx } from "~/test/utils/withRuntimeFx";

describe("ignore read model", () => {
	it("collection, fetch and count reflect toggle state and respect scope", async () => {
		const database = await testabase("ignoreReadModelFx");
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

			const { user: seller } = yield* signUp("ignore-read-seller@test.cz", "Ignore Seller");
			const { user: buyer } = yield* signUp("ignore-read-buyer@test.cz", "Ignore Buyer");
			const { user: stranger } = yield* signUp(
				"ignore-read-stranger@test.cz",
				"Ignore Stranger",
			);

			const listing = yield* createListingFx(seller.id);

			yield* ignoreToggleFx({
				userId: buyer.id,
				listingId: listing.id,
				toggle: true,
			});

			const collection = yield* ignoreCollectionFx({
				scope: {
					userId: buyer.id,
				},
			});

			expect(collection).toHaveLength(1);

			const ignored = yield* ignoreFetchFx({
				scope: {
					userId: buyer.id,
				},
				where: {
					listingId: listing.id,
				},
			});

			expect(ignored.listingId).toBe(listing.id);

			const count = yield* ignoreCountFx({
				scope: {
					userId: buyer.id,
				},
			});

			expect(count.total).toBe(1);

			const strangerCollection = yield* ignoreCollectionFx({
				scope: {
					userId: stranger.id,
				},
			});

			expect(strangerCollection).toEqual([]);

			yield* ignoreToggleFx({
				userId: buyer.id,
				listingId: listing.id,
				toggle: false,
			});

			const afterCollection = yield* ignoreCollectionFx({
				scope: {
					userId: buyer.id,
				},
			});
			const afterCount = yield* ignoreCountFx({
				scope: {
					userId: buyer.id,
				},
			});
			const afterFetch = yield* Effect.either(
				ignoreFetchFx({
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
