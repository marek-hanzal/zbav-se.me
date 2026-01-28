import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { userEventBuyerInfoFx } from "~/@buyer-user/user-event/fx/userEventBuyerInfoFx";
import { KyselyContextLayer } from "~/database/context/KyselyContextLayer";
import { testabase } from "~test/testabase";

describe("userEventBuyerInfoFx", () => {
	it("Empty user's info returns nothing", async () => {
		const kysely = await testabase("userEventBuyerInfoFx-empty");

		const result = await Effect.runPromise(
			Effect.gen(function* () {
				return yield* userEventBuyerInfoFx({
					userId: "test-user-id",
				});
			}).pipe(Effect.provide(KyselyContextLayer(kysely))),
		);

		expect(result).toBeNull();
	});
});
