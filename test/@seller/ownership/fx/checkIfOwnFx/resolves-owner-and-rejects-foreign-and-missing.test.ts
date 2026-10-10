import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { draftCheckIfOwnFx } from "~/seller-draft/fx/draftCheckIfOwnFx";
import { draftCreateFx } from "~/seller-draft/fx/draftCreateFx";
import { listingCheckIfOwnFx } from "~/seller-listing/fx/listingCheckIfOwnFx";
import { expectTaggedErrorFn } from "~/test/common/fx/expectTaggedErrorFn";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { testabaseFn } from "~/test/testabaseFn";
import { createUsersFx } from "~/test/user/fx/createUsersFx";

describe("seller ownership helpers", () => {
	it("return the owner id and reject foreign or missing draft/listing access", async () => {
		const database = await testabaseFn("seller-ownership-helpers");

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
			const foreignDraft = yield* Effect.result(
				draftCheckIfOwnFx({
					userId: users.stranger.id,
					draftId: draft.id,
				}),
			);
			const missingDraft = yield* Effect.result(
				draftCheckIfOwnFx({
					userId: users.seller.id,
					draftId: "missing-draft-id",
				}),
			);

			const ownListingUserId = yield* listingCheckIfOwnFx({
				userId: users.seller.id,
				listingId: listing.id,
			});
			const foreignListing = yield* Effect.result(
				listingCheckIfOwnFx({
					userId: users.stranger.id,
					listingId: listing.id,
				}),
			);
			const missingListing = yield* Effect.result(
				listingCheckIfOwnFx({
					userId: users.seller.id,
					listingId: "missing-listing-id",
				}),
			);

			expect(ownDraftUserId).toBe(users.seller.id);
			expectTaggedErrorFn(foreignDraft, {
				tag: "NotFoundErrorFx",
				message: "Draft not found",
			});
			expectTaggedErrorFn(missingDraft, {
				tag: "NotFoundErrorFx",
				message: "Draft not found",
			});
			expect(ownListingUserId).toBe(users.seller.id);
			expectTaggedErrorFn(foreignListing, {
				tag: "NotFoundErrorFx",
				message: "Listing not found",
			});
			expectTaggedErrorFn(missingListing, {
				tag: "NotFoundErrorFx",
				message: "Listing not found",
			});
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
