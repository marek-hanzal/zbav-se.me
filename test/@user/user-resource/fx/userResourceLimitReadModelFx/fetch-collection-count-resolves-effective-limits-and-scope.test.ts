import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { DateContextFx } from "@/lib/common/date";
import type { ResourceDefinitionEnumSchema } from "~/common/resource-definition/enum/ResourceDefinitionEnumSchema";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { userResourceLimitCollectionFx } from "~/user/user-resource/server/fx/userResourceLimitCollectionFx";
import { userResourceLimitCountFx } from "~/user/user-resource/server/fx/userResourceLimitCountFx";
import { userResourceLimitFetchFx } from "~/user/user-resource/server/fx/userResourceLimitFetchFx";

interface UserResourceLimitInsert {
	userId: string;
	resourceDefinitionId: ResourceDefinitionEnumSchema.Type;
	reference: string | null;
	createdAt: Date;
	availableAt: Date;
	expiresAt: Date | null;
	limit: number;
}

const atFx = <A, E, R>(iso: string, eff: Effect.Effect<A, E, R>) =>
	eff.pipe(
		Effect.provideService(DateContextFx, {
			now: () => DateTime.fromISO(iso),
		}),
	);

const date = (iso: string) => new Date(iso);

const limitRow = (
	userId: string,
	resourceDefinitionId: ResourceDefinitionEnumSchema.Type,
	reference: string | null,
	availableAt: string,
	createdAt: string,
	expiresAt: string | null,
	limit: number,
): UserResourceLimitInsert => ({
	userId,
	resourceDefinitionId,
	reference,
	createdAt: date(createdAt),
	availableAt: date(availableAt),
	expiresAt: expiresAt ? date(expiresAt) : null,
	limit,
});

describe("userResourceLimit read model fx", () => {
	it("dedupes active windows, resolves reference fallback, counts effective contexts, and isolates users", async () => {
		const database = await testabase("user-resource-limit-read-model");

		return Effect.gen(function* () {
			const { seller, buyer } = yield* createUsersFx({});

			yield* Effect.promise(() =>
				database.kysely
					.insertInto("user_resource_limit")
					.values([
						limitRow(
							seller.id,
							"listing.count",
							null,
							"2026-05-10T08:00:00.000Z",
							"2026-05-10T08:00:00.000Z",
							null,
							2,
						),
						limitRow(
							seller.id,
							"listing.count",
							null,
							"2026-05-12T08:00:00.000Z",
							"2026-05-12T08:30:00.000Z",
							null,
							3,
						),
						limitRow(
							seller.id,
							"listing.count",
							null,
							"2026-05-12T08:00:00.000Z",
							"2026-05-12T08:45:00.000Z",
							null,
							7,
						),
						limitRow(
							seller.id,
							"listing.count",
							null,
							"2026-05-11T08:00:00.000Z",
							"2026-05-11T08:30:00.000Z",
							"2026-05-12T09:00:00.000Z",
							1,
						),
						limitRow(
							seller.id,
							"listing.count",
							null,
							"2026-05-13T08:00:00.000Z",
							"2026-05-13T08:30:00.000Z",
							null,
							99,
						),
						limitRow(
							seller.id,
							"feed.count",
							null,
							"2026-05-10T09:00:00.000Z",
							"2026-05-10T09:00:00.000Z",
							null,
							4,
						),
						limitRow(
							seller.id,
							"feed.count",
							"draft-1",
							"2026-05-11T09:00:00.000Z",
							"2026-05-11T09:00:00.000Z",
							null,
							14,
						),
						limitRow(
							seller.id,
							"feed.count",
							"draft-1",
							"2026-05-11T09:00:00.000Z",
							"2026-05-11T09:30:00.000Z",
							null,
							16,
						),
						limitRow(
							seller.id,
							"feed.count",
							"draft-2",
							"2026-05-11T09:00:00.000Z",
							"2026-05-11T09:00:00.000Z",
							null,
							24,
						),
						limitRow(
							seller.id,
							"feed.count",
							null,
							"2026-05-13T09:00:00.000Z",
							"2026-05-13T09:00:00.000Z",
							null,
							44,
						),
						limitRow(
							seller.id,
							"listing.gallery.count",
							null,
							"2026-05-10T10:00:00.000Z",
							"2026-05-10T10:00:00.000Z",
							null,
							10,
						),
						limitRow(
							seller.id,
							"listing.gallery.count",
							"draft-1",
							"2026-05-11T10:00:00.000Z",
							"2026-05-11T10:00:00.000Z",
							"2026-05-12T12:00:00.000Z",
							20,
						),
						limitRow(
							seller.id,
							"listing.gallery.count",
							"draft-1",
							"2026-05-11T10:00:00.000Z",
							"2026-05-11T10:30:00.000Z",
							"2026-05-12T11:00:00.000Z",
							15,
						),
						limitRow(
							seller.id,
							"listing.gallery.count",
							"draft-1",
							"2026-05-12T11:30:00.000Z",
							"2026-05-12T11:30:00.000Z",
							null,
							25,
						),
						limitRow(
							seller.id,
							"listing.gallery.count",
							"draft-2",
							"2026-05-11T11:00:00.000Z",
							"2026-05-11T11:00:00.000Z",
							null,
							18,
						),
						limitRow(
							seller.id,
							"listing.gallery.count",
							"draft-2",
							"2026-05-11T11:00:00.000Z",
							"2026-05-11T11:30:00.000Z",
							null,
							19,
						),
						limitRow(
							seller.id,
							"listing.gallery.count",
							"draft-2",
							"2026-05-12T09:30:00.000Z",
							"2026-05-12T09:30:00.000Z",
							"2026-05-12T09:45:00.000Z",
							21,
						),
						limitRow(
							seller.id,
							"listing.gallery.count",
							"draft-2",
							"2026-05-13T11:00:00.000Z",
							"2026-05-13T11:00:00.000Z",
							null,
							22,
						),
						limitRow(
							seller.id,
							"listing.gallery.count",
							"draft-3",
							"2026-05-10T11:00:00.000Z",
							"2026-05-10T11:00:00.000Z",
							null,
							12,
						),
						limitRow(
							seller.id,
							"listing.gallery.count",
							"draft-3",
							"2026-05-11T11:00:00.000Z",
							"2026-05-11T11:00:00.000Z",
							null,
							13,
						),
						limitRow(
							seller.id,
							"listing.gallery.count",
							"draft-3",
							"2026-05-11T11:00:00.000Z",
							"2026-05-11T11:05:00.000Z",
							null,
							14,
						),
						limitRow(
							seller.id,
							"listing.gallery.count",
							"draft-expired",
							"2026-05-11T11:00:00.000Z",
							"2026-05-11T11:00:00.000Z",
							"2026-05-12T09:00:00.000Z",
							40,
						),
						limitRow(
							seller.id,
							"listing.gallery.count",
							"draft-future",
							"2026-05-12T11:30:00.000Z",
							"2026-05-12T11:30:00.000Z",
							null,
							30,
						),
						limitRow(
							buyer.id,
							"feed.count",
							null,
							"2026-05-10T12:00:00.000Z",
							"2026-05-10T12:00:00.000Z",
							null,
							1,
						),
						limitRow(
							buyer.id,
							"listing.gallery.count",
							"draft-1",
							"2026-05-10T12:00:00.000Z",
							"2026-05-10T12:00:00.000Z",
							null,
							666,
						),
					])
					.execute(),
			);

			const listingTieBreakLimit = yield* atFx(
				"2026-05-12T10:00:00.000Z",
				userResourceLimitFetchFx({
					scope: {
						userId: seller.id,
					},
					where: {
						resourceDefinitionId: "listing.count",
					},
				}),
			);
			const futureListingLimit = yield* atFx(
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
			const draftOverrideTieBreakLimit = yield* atFx(
				"2026-05-12T10:00:00.000Z",
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
			const draftOverrideAfterShortShotExpiresLimit = yield* atFx(
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
			const draftOverrideAfterNewWindowLimit = yield* atFx(
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
			const draftTwoTieBreakLimit = yield* atFx(
				"2026-05-12T10:00:00.000Z",
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
			const draftTwoFutureWindowLimit = yield* atFx(
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
			const draftThreeTieBreakLimit = yield* atFx(
				"2026-05-12T10:00:00.000Z",
				userResourceLimitFetchFx({
					scope: {
						userId: seller.id,
					},
					where: {
						resourceDefinitionId: "listing.gallery.count",
						reference: "draft-3",
					},
				}),
			);
			const draftFeedOverrideLimit = yield* atFx(
				"2026-05-12T10:00:00.000Z",
				userResourceLimitFetchFx({
					scope: {
						userId: seller.id,
					},
					where: {
						resourceDefinitionId: "feed.count",
						reference: "draft-1",
					},
				}),
			);
			const expiredOverrideFallbackLimit = yield* atFx(
				"2026-05-12T10:00:00.000Z",
				userResourceLimitFetchFx({
					scope: {
						userId: seller.id,
					},
					where: {
						resourceDefinitionId: "listing.gallery.count",
						reference: "draft-expired",
					},
				}),
			);
			const futureOverrideFallbackLimit = yield* atFx(
				"2026-05-12T10:00:00.000Z",
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
			const futureOverrideAvailableLimit = yield* atFx(
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
			const missingOverrideFallbackLimit = yield* atFx(
				"2026-05-12T10:00:00.000Z",
				userResourceLimitFetchFx({
					scope: {
						userId: seller.id,
					},
					where: {
						resourceDefinitionId: "listing.gallery.count",
						reference: "draft-missing",
					},
				}),
			);
			const buyerScopedLimit = yield* atFx(
				"2026-05-12T10:00:00.000Z",
				userResourceLimitFetchFx({
					scope: {
						userId: buyer.id,
					},
					where: {
						resourceDefinitionId: "feed.count",
					},
				}),
			);
			const sellerCollectionForDraft = yield* atFx(
				"2026-05-12T10:00:00.000Z",
				userResourceLimitCollectionFx({
					scope: {
						userId: seller.id,
					},
					where: {
						reference: "draft-1",
					},
					sort: [
						{
							field: "resourceDefinitionId",
							order: "asc",
						},
					],
					cursor: {
						page: 0,
						size: 10,
					},
				}),
			);
			const sellerCollectionWithoutReference = yield* atFx(
				"2026-05-12T10:00:00.000Z",
				userResourceLimitCollectionFx({
					scope: {
						userId: seller.id,
					},
					sort: [
						{
							field: "resourceDefinitionId",
							order: "asc",
						},
						{
							field: "reference",
							order: "asc",
						},
					],
					cursor: {
						page: 0,
						size: 20,
					},
				}),
			);
			const sellerCountWithoutReference = yield* atFx(
				"2026-05-12T10:00:00.000Z",
				userResourceLimitCountFx({
					scope: {
						userId: seller.id,
					},
				}),
			);
			const sellerCountForDraft = yield* atFx(
				"2026-05-12T10:00:00.000Z",
				userResourceLimitCountFx({
					scope: {
						userId: seller.id,
					},
					where: {
						reference: "draft-1",
					},
				}),
			);
			const buyerCountWithoutReference = yield* atFx(
				"2026-05-12T10:00:00.000Z",
				userResourceLimitCountFx({
					scope: {
						userId: buyer.id,
					},
				}),
			);

			expect(listingTieBreakLimit.limit).toBe(7);
			expect(listingTieBreakLimit.reference).toBeNull();
			expect(futureListingLimit.limit).toBe(99);

			expect(draftOverrideTieBreakLimit.limit).toBe(15);
			expect(draftOverrideTieBreakLimit.reference).toBe("draft-1");
			expect(draftOverrideAfterShortShotExpiresLimit.limit).toBe(20);
			expect(draftOverrideAfterNewWindowLimit.limit).toBe(25);
			expect(draftTwoTieBreakLimit.limit).toBe(19);
			expect(draftTwoTieBreakLimit.reference).toBe("draft-2");
			expect(draftTwoFutureWindowLimit.limit).toBe(22);
			expect(draftTwoFutureWindowLimit.reference).toBe("draft-2");
			expect(draftThreeTieBreakLimit.limit).toBe(14);
			expect(draftThreeTieBreakLimit.reference).toBe("draft-3");
			expect(draftFeedOverrideLimit.limit).toBe(16);
			expect(draftFeedOverrideLimit.reference).toBe("draft-1");
			expect(expiredOverrideFallbackLimit.limit).toBe(10);
			expect(expiredOverrideFallbackLimit.reference).toBeNull();
			expect(futureOverrideFallbackLimit.limit).toBe(10);
			expect(futureOverrideFallbackLimit.reference).toBeNull();
			expect(futureOverrideAvailableLimit.limit).toBe(30);
			expect(futureOverrideAvailableLimit.reference).toBe("draft-future");
			expect(missingOverrideFallbackLimit.limit).toBe(10);
			expect(missingOverrideFallbackLimit.reference).toBeNull();

			expect(buyerScopedLimit.limit).toBe(1);

			expect(sellerCollectionForDraft).toHaveLength(3);
			expect(sellerCollectionForDraft.map((item) => item.resourceDefinitionId)).toEqual([
				"feed.count",
				"listing.count",
				"listing.gallery.count",
			]);
			expect(
				sellerCollectionForDraft.find(
					(item) => item.resourceDefinitionId === "listing.gallery.count",
				),
			).toMatchObject({
				reference: "draft-1",
				limit: 15,
			});
			expect(
				sellerCollectionForDraft.find((item) => item.resourceDefinitionId === "feed.count"),
			).toMatchObject({
				reference: "draft-1",
				limit: 16,
			});

			expect(sellerCollectionWithoutReference).toHaveLength(8);
			expect(
				sellerCollectionWithoutReference.map((item) => ({
					resourceDefinitionId: item.resourceDefinitionId,
					reference: item.reference,
					limit: item.limit,
				})),
			).toEqual(
				expect.arrayContaining([
					{
						resourceDefinitionId: "listing.count",
						reference: null,
						limit: 7,
					},
					{
						resourceDefinitionId: "feed.count",
						reference: null,
						limit: 4,
					},
					{
						resourceDefinitionId: "feed.count",
						reference: "draft-1",
						limit: 16,
					},
					{
						resourceDefinitionId: "feed.count",
						reference: "draft-2",
						limit: 24,
					},
					{
						resourceDefinitionId: "listing.gallery.count",
						reference: null,
						limit: 10,
					},
					{
						resourceDefinitionId: "listing.gallery.count",
						reference: "draft-1",
						limit: 15,
					},
					{
						resourceDefinitionId: "listing.gallery.count",
						reference: "draft-2",
						limit: 19,
					},
					{
						resourceDefinitionId: "listing.gallery.count",
						reference: "draft-3",
						limit: 14,
					},
				]),
			);

			expect(sellerCountWithoutReference).toBe(8);
			expect(sellerCountForDraft).toBe(3);
			expect(buyerCountWithoutReference).toBe(2);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
