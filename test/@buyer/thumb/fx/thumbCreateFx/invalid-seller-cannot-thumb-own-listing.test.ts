import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { thumbCreateFx } from "~/buyer/thumb/server/fx/thumbCreateFx";
import { auth } from "~/server/auth/auth";
import { testabase } from "~/test/testabase";
import { createListingFx } from "~/test/utils/createListingFx";
import { createUserFx } from "~/test/utils/createUserFx";
import { expectErrorFx } from "~/test/utils/expectErrorFx";
import { withRuntimeFx } from "~/test/utils/withRuntimeFx";

describe("thumbCreateFx", () => {
	it("rejects when seller tries to thumb their own listing", async () => {
		const database = await testabase("thumbCreate-own-listing");
		const { api } = auth(() => database.dialect);

		return Effect.gen(function* () {
			const seller = yield* createUserFx({
				api,
				email: "thumb-own-listing@test.cz",
				name: "Thumb Own Listing",
			});

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
