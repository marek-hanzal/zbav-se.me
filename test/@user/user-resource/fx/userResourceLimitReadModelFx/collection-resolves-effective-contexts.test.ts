import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { userResourceLimitCollectionFx } from "~/user/user-resource/server/fx/userResourceLimitCollectionFx";
import {
	atUserResourceLimitReadModelFx,
	seedUserResourceLimitReadModelFx,
} from "./userResourceLimitReadModelFixture";

describe("userResourceLimit read model fx", () => {
	it("collection resolves effective resource bundle limits", async () => {
		const database = await testabase("user-resource-limit-collection");

		return Effect.gen(function* () {
			const { seller } = yield* seedUserResourceLimitReadModelFx(database);

			const sellerCollectionForDraft = yield* atUserResourceLimitReadModelFx(
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
			const sellerCollectionWithoutReference = yield* atUserResourceLimitReadModelFx(
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
				reference: null,
				limit: 10,
			});
			expect(
				sellerCollectionForDraft.find((item) => item.resourceDefinitionId === "feed.count"),
			).toMatchObject({
				reference: null,
				limit: 4,
			});

			expect(sellerCollectionWithoutReference).toHaveLength(3);
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
						resourceDefinitionId: "listing.gallery.count",
						reference: null,
						limit: 10,
					},
				]),
			);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
