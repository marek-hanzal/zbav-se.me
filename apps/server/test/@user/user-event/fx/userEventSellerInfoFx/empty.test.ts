import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { userEventSellerInfoFx } from "~/@user/user-event/fx/userEventSellerInfoFx";
import { DatabaseContextProvider } from "~/database/fx/DatabaseContextFx";
import { testabase } from "../../../../testabase";

describe("userEventSellerInfoFx", () => {
	it("Empty user's info returns nothing", async () => {
		const database = await testabase("userEventSellerInfoFx-empty");

		const kysely = await database.kysely();

		const result = await Effect.runPromise(
			Effect.gen(function* () {
				return yield* userEventSellerInfoFx({
					userId: "test-user-id",
				});
			}).pipe(DatabaseContextProvider(kysely)),
		);

		expect(result).toBeNull();
	});
});
