import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { thumbCreateFx } from "~/buyer/thumb/server/fx/thumbCreateFx";
import { auth } from "~/server/auth/auth";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { testabase } from "~/test/testabase";

describe("thumbCreateFx", () => {
	it("creates thumb record, listing event, seller inbox and returns listing with thumb", async () => {
		const database = await testabase("thumbCreate-side-effects");
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

			const { user: seller } = yield* signUp("thumb-seller@test.cz", "Thumb Seller");
			const { user: buyer } = yield* signUp("thumb-buyer@test.cz", "Thumb Buyer");

			const listing = yield* createListingFx(seller.id);

			const updatedListing = yield* thumbCreateFx({
				userId: buyer.id,
				listingId: listing.id,
				type: "like",
			});

			expect(updatedListing.id).toBe(listing.id);
			expect(updatedListing.thumb).toBe("like");

			const thumb = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("thumb")
					.select([
						"userId",
						"listingId",
						"type",
					])
					.where("userId", "=", buyer.id)
					.where("listingId", "=", listing.id)
					.executeTakeFirst(),
			);

			expect(thumb).toEqual({
				userId: buyer.id,
				listingId: listing.id,
				type: "like",
			});

			const events = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("listing_event")
					.select("event")
					.where("listingId", "=", listing.id)
					.execute(),
			);

			expect(events.map((item) => item.event)).toContain("like");

			const inbox = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("inbox")
					.select([
						"userId",
						"family",
						"type",
						"reference",
						"payload",
					])
					.where("userId", "=", seller.id)
					.where("type", "=", "thumb")
					.executeTakeFirst(),
			);

			expect(inbox?.family).toBe("reaction");
			expect(inbox?.reference).toEqual([
				listing.id,
			]);
			expect(inbox?.payload).toEqual({
				listingId: listing.id,
				thumb: "like",
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
