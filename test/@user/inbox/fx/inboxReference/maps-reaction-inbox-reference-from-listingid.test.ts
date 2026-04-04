import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { thumbCreateFx } from "~/buyer/thumb/server/fx/thumbCreateFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

describe("inbox reference", () => {
	it("maps reaction inbox reference from listingId", async () => {
		const database = await testabase("inboxReference-thumb-create");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});
			const buyer = yield* leaseTestUserFx({});
			const listing = yield* createListingFx(seller.id, {
				title: "Reference fixture listing",
			});

			yield* thumbCreateFx({
				listingId: listing.id,
				type: "like",
				userId: buyer.id,
			});

			const inbox = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("inbox")
					.select([
						"id",
						"reference",
						"type",
						"userId",
					])
					.where("userId", "=", seller.id)
					.where("type", "=", "thumb")
					.executeTakeFirstOrThrow(),
			);

			expect(inbox.reference).toEqual([
				listing.id,
			]);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
