import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { listingCollectionFx } from "~/@buyer/listing/fx/listingCollectionFx";
import { auth } from "~/auth/auth";
import { testabase } from "~/test/testabase";
import { createOpenScenarioFx } from "~/test/utils/createOpenScenarioFx";
import { withRuntimeFx } from "~/test/utils/withRuntimeFx";

describe("listingCollectionFx (buyer) — listing status visibility", () => {
	it("listing remains visible while transaction is open (not yet sold)", async () => {
		const database = await testabase("listingCollection-open-still-live");
		const { api } = auth(() => database.dialect);

		const { user: seller } = await api.signUpEmail({
			body: {
				email: "seller@listing-open.cz",
				name: "Seller",
				password: "12345678",
			},
		});
		const { user: buyer } = await api.signUpEmail({
			body: {
				email: "buyer@listing-open.cz",
				name: "Buyer",
				password: "12345678",
			},
		});

		// Accept transaction → listing is still "live"
		const { listingId } = await createOpenScenarioFx({
			sellerId: seller.id,
			buyerId: buyer.id,
			database,
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		const { status } = await database.kysely
			.selectFrom("listing")
			.select("status")
			.where("id", "=", listingId)
			.executeTakeFirstOrThrow();

		expect(status).toBe("live");

		const collection = await Effect.gen(function* () {
			return yield* listingCollectionFx({
				userId: buyer.id,
				scope: {},
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		const ids = collection.map((l) => l.id);
		expect(ids).toContain(listingId);
	});
});
