import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import type { ResourceDefinitionEnumSchema } from "~/common/resource-definition/enum/ResourceDefinitionEnumSchema";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { userResourceLimitFetchFx } from "~/user/user-resource/server/fx/userResourceLimitFetchFx";
import {
	atUserResourceLimitReadModelFx,
	seedUserResourceLimitReadModelFx,
} from "./userResourceLimitReadModelFixture";

describe("userResourceLimit read model fx", () => {
	it("fetch resolves effective limits, reference fallbacks, tie breaks and user scope", async () => {
		const database = await testabase("user-resource-limit-fetch");

		return Effect.gen(function* () {
			const { seller, buyer } = yield* seedUserResourceLimitReadModelFx(database);

			const fetchLimit = (
				userId: string,
				resourceDefinitionId: ResourceDefinitionEnumSchema.Type,
				reference?: string,
			) =>
				atUserResourceLimitReadModelFx(
					"2026-05-12T10:00:00.000Z",
					userResourceLimitFetchFx({
						scope: {
							userId,
						},
						where: {
							resourceDefinitionId,
							reference,
						},
					}),
				);

			const listingTieBreakLimit = yield* fetchLimit(seller.id, "listing.count");
			const futureListingLimit = yield* atUserResourceLimitReadModelFx(
				"2026-05-13T10:00:00.000Z",
				userResourceLimitFetchFx({
					scope: {
						userId: seller.id,
					},
					where: {
						resourceDefinitionId: "listing.count",
					},
				}),
			);
			const draftOverrideTieBreakLimit = yield* fetchLimit(
				seller.id,
				"listing.gallery.count",
				"draft-1",
			);
			const draftOverrideAfterShortShotExpiresLimit = yield* atUserResourceLimitReadModelFx(
				"2026-05-12T11:15:00.000Z",
				userResourceLimitFetchFx({
					scope: {
						userId: seller.id,
					},
					where: {
						resourceDefinitionId: "listing.gallery.count",
						reference: "draft-1",
					},
				}),
			);
			const draftOverrideAfterNewWindowLimit = yield* atUserResourceLimitReadModelFx(
				"2026-05-12T11:45:00.000Z",
				userResourceLimitFetchFx({
					scope: {
						userId: seller.id,
					},
					where: {
						resourceDefinitionId: "listing.gallery.count",
						reference: "draft-1",
					},
				}),
			);
			const draftTwoTieBreakLimit = yield* fetchLimit(
				seller.id,
				"listing.gallery.count",
				"draft-2",
			);
			const draftTwoFutureWindowLimit = yield* atUserResourceLimitReadModelFx(
				"2026-05-13T12:00:00.000Z",
				userResourceLimitFetchFx({
					scope: {
						userId: seller.id,
					},
					where: {
						resourceDefinitionId: "listing.gallery.count",
						reference: "draft-2",
					},
				}),
			);
			const draftThreeTieBreakLimit = yield* fetchLimit(
				seller.id,
				"listing.gallery.count",
				"draft-3",
			);
			const draftFeedOverrideLimit = yield* fetchLimit(seller.id, "feed.count", "draft-1");
			const expiredOverrideFallbackLimit = yield* fetchLimit(
				seller.id,
				"listing.gallery.count",
				"draft-expired",
			);
			const futureOverrideFallbackLimit = yield* fetchLimit(
				seller.id,
				"listing.gallery.count",
				"draft-future",
			);
			const futureOverrideAvailableLimit = yield* atUserResourceLimitReadModelFx(
				"2026-05-12T11:45:00.000Z",
				userResourceLimitFetchFx({
					scope: {
						userId: seller.id,
					},
					where: {
						resourceDefinitionId: "listing.gallery.count",
						reference: "draft-future",
					},
				}),
			);
			const missingOverrideFallbackLimit = yield* fetchLimit(
				seller.id,
				"listing.gallery.count",
				"draft-missing",
			);
			const buyerScopedLimit = yield* fetchLimit(buyer.id, "feed.count");

			expect(listingTieBreakLimit).toMatchObject({
				limit: 7,
				reference: null,
			});
			expect(futureListingLimit.limit).toBe(99);
			expect(draftOverrideTieBreakLimit).toMatchObject({
				limit: 15,
				reference: "draft-1",
			});
			expect(draftOverrideAfterShortShotExpiresLimit.limit).toBe(20);
			expect(draftOverrideAfterNewWindowLimit.limit).toBe(25);
			expect(draftTwoTieBreakLimit).toMatchObject({
				limit: 19,
				reference: "draft-2",
			});
			expect(draftTwoFutureWindowLimit).toMatchObject({
				limit: 22,
				reference: "draft-2",
			});
			expect(draftThreeTieBreakLimit).toMatchObject({
				limit: 14,
				reference: "draft-3",
			});
			expect(draftFeedOverrideLimit).toMatchObject({
				limit: 16,
				reference: "draft-1",
			});
			expect(expiredOverrideFallbackLimit).toMatchObject({
				limit: 10,
				reference: null,
			});
			expect(futureOverrideFallbackLimit).toMatchObject({
				limit: 10,
				reference: null,
			});
			expect(futureOverrideAvailableLimit).toMatchObject({
				limit: 30,
				reference: "draft-future",
			});
			expect(missingOverrideFallbackLimit).toMatchObject({
				limit: 10,
				reference: null,
			});
			expect(buyerScopedLimit.limit).toBe(1);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
