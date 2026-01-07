import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { userEventSellerInfoFx } from "~/app/user-event/fx/userEventSellerInfoFx";
import { KyselyContextProvider } from "~/database/context/KyselyContextFx";
import { testabase } from "../../../../testabase";

describe("userEventSellerInfoFx", () => {
	it("Empty user's info returns nothing", async () => {
		const kysely = await testabase("userEventSellerInfoFx-empty");

		const result = await Effect.runPromise(
			Effect.gen(function* () {
				return yield* userEventSellerInfoFx({
					userId: "test-user-id",
				});
			}).pipe(KyselyContextProvider(kysely)),
		);

		expect(result).toBeNull();
	});
});
