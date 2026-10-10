import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { thumbCreateFx } from "~/buyer-thumb/fx/thumbCreateFx";
import { expectErrorFn } from "~/test/common/fx/expectErrorFn";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { testabaseFn } from "~/test/testabaseFn";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

describe("thumbCreateFx", () => {
	it("rejects when seller tries to thumb their own listing", async () => {
		const database = await testabaseFn("thumbCreate-own-listing");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});

			const listing = yield* createListingFx(seller.id);

			const result = yield* Effect.result(
				thumbCreateFx({
					userId: seller.id,
					listingId: listing.id,
					type: "dislike",
				}),
			);

			expectErrorFn(result);

			const thumbCount = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("thumb")
					.select((ebFn) => ebFn.fn.countAll<number>().as("count"))
					.executeTakeFirstOrThrow(),
			);

			expect(Number(thumbCount.count)).toBe(0);
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
