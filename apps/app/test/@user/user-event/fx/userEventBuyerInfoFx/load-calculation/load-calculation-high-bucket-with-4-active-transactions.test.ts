import { DateContextFx } from "@use-pico/common/date";
import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { userEventBuyerInfoFx } from "~/client/@seller/user-event/server/fx/userEventBuyerInfoFx";
import { userEventCreateFx } from "~/client/@user/user-event/server/fx/userEventCreateFx";
import { auth } from "~/server/auth/auth";
import { withDateFx } from "~/server/database/fx/withDateFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { testabase } from "~/test/testabase";

describe("userEventBuyerInfoFx", () => {
	it("Load calculation - high bucket with 4+ active transactions", async () => {
		const database = await testabase("userEventBuyerInfoFx-load-calculation-high");

		const { api } = auth(() => {
			return database.dialect;
		});

		const { user: buyer } = await api.signUpEmail({
			body: {
				email: "buyer@test.cz",
				name: "Buyer",
				password: "12345678",
			},
		});

		const buyerId = buyer.id;
		const baseTime = DateTime.now().minus({
			days: 30,
		});

		const result = await Effect.gen(function* () {
			// 5 active transactions (create only)
			for (let i = 0; i < 5; i++) {
				yield* userEventCreateFx({
					userId: buyerId,
					scope: "user",
					source: "transaction",
					group: `tx-${i}`,
					event: "transaction.create",
					isTerminal: false,
				}).pipe(
					Effect.provideService(DateContextFx, {
						now() {
							return baseTime.plus({
								days: i,
							});
						},
					}),
				);
			}

			return yield* userEventBuyerInfoFx({
				userId: buyerId,
			});
		}).pipe(withKyselyFx(database), withDateFx, Effect.runPromise);

		expect(result).not.toBeNull();
		if (!result) return;

		expect(result.load.bucket).toBe("high");
	});
});
