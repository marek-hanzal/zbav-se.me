import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { draftCheckIfOwnFx } from "~/seller/draft/server/fx/draftCheckIfOwnFx";
import { draftCreateFx } from "~/seller/draft/server/fx/draftCreateFx";
import { listingCheckIfOwnFx } from "~/seller/listing/server/fx/listingCheckIfOwnFx";
import { expectTaggedErrorFx } from "~/test/common/fx/expectTaggedErrorFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { testabase } from "~/test/testabase";
import { createUsersFx } from "~/test/user/fx/createUsersFx";

describe("seller ownership helpers", () => {
	it("return the owner id and reject foreign or missing draft/listing access", async () => {
		const database = await testabase("seller-ownership-helpers");

		return Effect.gen(function* () {
			const users = yield* createUsersFx({});

			const draft = yield* draftCreateFx({
				userId: users.seller.id,
			});
			const listing = yield* createListingFx(users.seller.id, {
				title: "qx-seller-ownership-listing",
			});

			const ownDraftUserId = yield* draftCheckIfOwnFx({
				userId: users.seller.id,
				draftId: draft.id,
			});
			const foreignDraft = yield* Effect.either(
				draftCheckIfOwnFx({
					userId: users.stranger.id,
					draftId: draft.id,
				}),
			);
			const missingDraft = yield* Effect.either(
				draftCheckIfOwnFx({
					userId: users.seller.id,
					draftId: "missing-draft-id",
				}),
			);

			const ownListingUserId = yield* listingCheckIfOwnFx({
				userId: users.seller.id,
				listingId: listing.id,
			});
			const foreignListing = yield* Effect.either(
				listingCheckIfOwnFx({
					userId: users.stranger.id,
					listingId: listing.id,
				}),
			);
			const missingListing = yield* Effect.either(
				listingCheckIfOwnFx({
					userId: users.seller.id,
					listingId: "missing-listing-id",
				}),
			);

			expect(ownDraftUserId).toBe(users.seller.id);
			expectTaggedErrorFx(foreignDraft, {
				tag: "NotFoundErrorFx",
				message: "Draft not found",
			});
			expectTaggedErrorFx(missingDraft, {
				tag: "NotFoundErrorFx",
				message: "Draft not found",
			});
			expect(ownListingUserId).toBe(users.seller.id);
			expectTaggedErrorFx(foreignListing, {
				tag: "NotFoundErrorFx",
				message: "Listing not found",
			});
			expectTaggedErrorFx(missingListing, {
				tag: "NotFoundErrorFx",
				message: "Listing not found",
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
