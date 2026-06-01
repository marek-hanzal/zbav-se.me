import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { resourceLimitFetchFx } from "~/common/resource/server/fx/resourceLimitFetchFx";
import type { ResourceDefinitionEnumSchema } from "~/common/resource-definition/enum/ResourceDefinitionEnumSchema";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import {
	atResourceLimitReadModelFx,
	seedResourceLimitReadModelFx,
} from "./resourceLimitReadModelFixture";

describe("resourceLimit read model fx", () => {
	it("fetch resolves effective resource bundle limits and user scope", async () => {
		const database = await testabase("resource-limit-fetch");

		return Effect.gen(function* () {
			const { seller, buyer } = yield* seedResourceLimitReadModelFx(database);

			const fetchLimit = (
				userId: string,
				resourceDefinitionId: ResourceDefinitionEnumSchema.Type,
			) =>
				atResourceLimitReadModelFx(
					"2026-05-12T10:00:00.000Z",
					resourceLimitFetchFx({
						scope: {
							userId,
						},
						where: {
							resourceDefinitionId,
						},
					}),
				);

			const listingTieBreakLimit = yield* fetchLimit(seller.id, "listing.count");
			const futureListingLimit = yield* atResourceLimitReadModelFx(
				"2026-05-13T10:00:00.000Z",
				resourceLimitFetchFx({
					scope: {
						userId: seller.id,
					},
					where: {
						resourceDefinitionId: "listing.count",
					},
				}),
			);
			const laterGalleryLimit = yield* atResourceLimitReadModelFx(
				"2026-05-12T11:45:00.000Z",
				resourceLimitFetchFx({
					scope: {
						userId: seller.id,
					},
					where: {
						resourceDefinitionId: "listing.gallery.count",
					},
				}),
			);
			const buyerScopedLimit = yield* fetchLimit(buyer.id, "feed.count");

			expect(listingTieBreakLimit).toMatchObject({
				limit: 7,
			});
			expect(futureListingLimit.limit).toBe(99);
			expect(laterGalleryLimit.limit).toBe(25);
			expect(buyerScopedLimit.limit).toBe(1);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
