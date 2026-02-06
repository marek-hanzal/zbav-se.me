import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { userEventSellerInfoFx } from "~/@buyer-session/user-event/fx/userEventSellerInfoFx";
import { KyselyContextLayer } from "~/database/context/KyselyContextLayer";
import { testabase } from "~test/testabase";

describe("userEventSellerInfoFx", () => {
	it("Empty user's info returns nothing", async () => {
		const kysely = await testabase("userEventSellerInfoFx-empty");

		const result = await Effect.runPromise(
			Effect.gen(function* () {
				return yield* userEventSellerInfoFx({
					userId: "test-user-id",
				});
			}).pipe(Effect.provide(KyselyContextLayer(kysely))),
		);

		expect(result).toBeNull();
	});
});
