import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { listingCollectionFx } from "~/server/@buyer/listing/fx/listingCollectionFx";
import { auth } from "~/server/auth/auth";
import { testabase } from "~/test/testabase";
import { createOpenScenarioFx } from "~/test/utils/createOpenScenarioFx";
import { withRuntimeFx } from "~/test/utils/withRuntimeFx";

describe("listingCollectionFx (buyer) — listing status visibility", () => {
	it("listing remains visible while transaction is open (not yet sold)", async () => {
		const database = await testabase("listingCollection-open-still-live");

		return Effect.gen(function* () {
			const { api } = auth(() => database.dialect);

			const { user: seller } = yield* Effect.promise(async () => {
				return api.signUpEmail({
					body: {
						email: "seller@listing-open.cz",
						name: "Seller",
						password: "12345678",
					},
				});
			});
			const { user: buyer } = yield* Effect.promise(async () => {
				return api.signUpEmail({
					body: {
						email: "buyer@listing-open.cz",
						name: "Buyer",
						password: "12345678",
					},
				});
			});

			// Accept transaction → listing is still "live"
			const { listingId } = yield* createOpenScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
				database,
			});

			const { status } = yield* Effect.promise(async () => {
				return database.kysely
					.selectFrom("listing")
					.select("status")
					.where("id", "=", listingId)
					.executeTakeFirstOrThrow();
			});

			expect(status).toBe("live");

			const collection = yield* listingCollectionFx({
				userId: buyer.id,
				scope: {},
			});

			const ids = collection.map((l) => l.id);
			expect(ids).toContain(listingId);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
