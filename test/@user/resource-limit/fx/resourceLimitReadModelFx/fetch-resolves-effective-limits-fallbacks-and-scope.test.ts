import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import type { ResourceDefinitionEnumSchema } from "~/resource-definition/schema/ResourceDefinitionEnumSchema";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";
import { resourceLimitFetchFx } from "~/user-resource-limit/fx/resourceLimitFetchFx";
import {
	atResourceLimitReadModelFx,
	seedResourceLimitReadModelFx,
} from "./resourceLimitReadModelFixture";

describe("resourceLimit read model fx", () => {
	it("fetch resolves effective resource bundle limits and user scope", async () => {
		const database = await testabaseFn("resource-limit-fetch");

		return Effect.gen(function* () {
			const { seller, buyer } = yield* seedResourceLimitReadModelFx(database);

			const fetchLimitFx = (
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

			const listingTieBreakLimit = yield* fetchLimitFx(
				seller.id,
				"seller:limit:listing.count",
			);
			const futureListingLimit = yield* atResourceLimitReadModelFx(
				"2026-05-13T10:00:00.000Z",
				resourceLimitFetchFx({
					scope: {
						userId: seller.id,
					},
					where: {
						resourceDefinitionId: "seller:limit:listing.count",
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
						resourceDefinitionId: "seller:limit:listing.gallery.count",
					},
				}),
			);
			const buyerScopedLimit = yield* fetchLimitFx(buyer.id, "buyer:limit:feed.count");

			expect(listingTieBreakLimit).toMatchObject({
				limit: 7,
			});
			expect(futureListingLimit.limit).toBe(99);
			expect(laterGalleryLimit.limit).toBe(25);
			expect(buyerScopedLimit.limit).toBe(1);
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
