import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { thumbCreateFx } from "~/buyer/thumb/server/fx/thumbCreateFx";
import { expectErrorFx } from "~/test/common/fx/expectErrorFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

describe("thumbCreateFx", () => {
	it("rejects when seller tries to thumb their own listing", async () => {
		const database = await testabase("thumbCreate-own-listing");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});

			const listing = yield* createListingFx(seller.id);

			const result = yield* Effect.either(
				thumbCreateFx({
					userId: seller.id,
					listingId: listing.id,
					type: "dislike",
				}),
			);

			expectErrorFx(result);

			const thumbCount = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("thumb")
					.select((eb) => eb.fn.countAll<number>().as("count"))
					.executeTakeFirstOrThrow(),
			);

			expect(Number(thumbCount.count)).toBe(0);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
