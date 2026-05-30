import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { DateContextFx } from "@/lib/common/date";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { userResourceLimitCollectionFx } from "~/user/user-resource/server/fx/userResourceLimitCollectionFx";
import { userResourceLimitCountFx } from "~/user/user-resource/server/fx/userResourceLimitCountFx";
import { userResourceLimitFetchFx } from "~/user/user-resource/server/fx/userResourceLimitFetchFx";

const atFx = <A, E, R>(iso: string, eff: Effect.Effect<A, E, R>) =>
	eff.pipe(
		Effect.provideService(DateContextFx, {
			now: () => DateTime.fromISO(iso),
		}),
	);

describe("userResourceLimit read model fx", () => {
	it("resolves base rows, reference overrides, overlap ordering, and seller scope", async () => {
		const database = await testabase("user-resource-limit-read-model");

		return Effect.gen(function* () {
			const { seller, buyer } = yield* createUsersFx({});

			yield* Effect.promise(() =>
				database.kysely
					.insertInto("user_resource_limit")
					.values([
						{
							userId: seller.id,
							resourceDefinitionId: "listing.count",
							reference: null,
							createdAt: new Date("2026-05-10T08:00:00.000Z"),
							availableAt: new Date("2026-05-10T08:00:00.000Z"),
							expiresAt: null,
							limit: 2,
						},
						{
							userId: seller.id,
							resourceDefinitionId: "listing.count",
							reference: null,
							createdAt: new Date("2026-05-12T08:30:00.000Z"),
							availableAt: new Date("2026-05-12T08:00:00.000Z"),
							expiresAt: null,
							limit: 3,
						},
						{
							userId: seller.id,
							resourceDefinitionId: "feed.count",
							reference: null,
							createdAt: new Date("2026-05-10T09:00:00.000Z"),
							availableAt: new Date("2026-05-10T09:00:00.000Z"),
							expiresAt: null,
							limit: 4,
						},
						{
							userId: seller.id,
							resourceDefinitionId: "listing.gallery.count",
							reference: null,
							createdAt: new Date("2026-05-10T10:00:00.000Z"),
							availableAt: new Date("2026-05-10T10:00:00.000Z"),
							expiresAt: null,
							limit: 10,
						},
						{
							userId: seller.id,
							resourceDefinitionId: "listing.gallery.count",
							reference: "draft-1",
							createdAt: new Date("2026-05-11T10:00:00.000Z"),
							availableAt: new Date("2026-05-11T10:00:00.000Z"),
							expiresAt: new Date("2026-05-12T12:00:00.000Z"),
							limit: 20,
						},
						{
							userId: seller.id,
							resourceDefinitionId: "listing.gallery.count",
							reference: "draft-1",
							createdAt: new Date("2026-05-11T10:30:00.000Z"),
							availableAt: new Date("2026-05-11T10:00:00.000Z"),
							expiresAt: new Date("2026-05-12T11:00:00.000Z"),
							limit: 15,
						},
						{
							userId: seller.id,
							resourceDefinitionId: "listing.gallery.count",
							reference: "draft-2",
							createdAt: new Date("2026-05-11T11:00:00.000Z"),
							availableAt: new Date("2026-05-11T11:00:00.000Z"),
							expiresAt: null,
							limit: 18,
						},
						{
							userId: seller.id,
							resourceDefinitionId: "feed.count",
							reference: null,
							createdAt: new Date("2026-05-13T09:00:00.000Z"),
							availableAt: new Date("2026-05-13T09:00:00.000Z"),
							expiresAt: null,
							limit: 99,
						},
						{
							userId: buyer.id,
							resourceDefinitionId: "feed.count",
							reference: null,
							createdAt: new Date("2026-05-10T12:00:00.000Z"),
							availableAt: new Date("2026-05-10T12:00:00.000Z"),
							expiresAt: null,
							limit: 1,
						},
					])
					.execute(),
			);

			const baseListingLimit = yield* atFx(
				"2026-05-12T10:00:00.000Z",
				userResourceLimitFetchFx({
					scope: {
						userId: seller.id,
					},
					where: {
						resourceDefinitionId: "listing.count",
						reference: null,
					},
				}),
			);
			const overrideBeforeExpiry = yield* atFx(
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
			const overrideAfterExpiry = yield* atFx(
				"2026-05-12T13:00:00.000Z",
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
			const collectionWithReference = yield* atFx(
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
			const sellerCount = yield* atFx(
				"2026-05-12T10:00:00.000Z",
				userResourceLimitCountFx({
					scope: {
						userId: seller.id,
					},
				}),
			);
			const buyerCount = yield* atFx(
				"2026-05-12T10:00:00.000Z",
				userResourceLimitCountFx({
					scope: {
						userId: buyer.id,
					},
				}),
			);

			expect(baseListingLimit.limit).toBe(3);
			expect(baseListingLimit.reference).toBeNull();
			expect(baseListingLimit.isAvailable).toBe(true);

			expect(overrideBeforeExpiry.limit).toBe(15);
			expect(overrideBeforeExpiry.reference).toBe("draft-1");

			expect(overrideAfterExpiry.limit).toBe(10);
			expect(overrideAfterExpiry.reference).toBeNull();

			expect(collectionWithReference).toHaveLength(3);
			expect(collectionWithReference.map((item) => item.resourceDefinitionId)).toEqual([
				"feed.count",
				"listing.count",
				"listing.gallery.count",
			]);
			expect(
				collectionWithReference.find(
					(item) => item.resourceDefinitionId === "listing.gallery.count",
				)?.limit,
			).toBe(15);

			expect(sellerCount).toBe(3);
			expect(buyerCount).toBe(1);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
