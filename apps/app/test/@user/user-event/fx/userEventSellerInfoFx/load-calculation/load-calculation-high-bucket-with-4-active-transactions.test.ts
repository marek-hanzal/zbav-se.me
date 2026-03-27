import { DateContextFx } from "@use-pico/common/date";
import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { userEventSellerInfoFx } from "~/buyer/user-event/server/fx/userEventSellerInfoFx";
import { auth } from "~/server/auth/auth";
import { withDateFx } from "~/server/database/fx/withDateFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { testabase } from "~/test/testabase";
import { userEventCreateFx } from "~/user/user-event/server/fx/userEventCreateFx";

describe("userEventSellerInfoFx", () => {
	it("Load calculation - high bucket with 4+ active transactions", async () => {
		const database = await testabase("userEventSellerInfoFx-load-calculation-high");

		const { api } = auth(() => {
			return database.dialect;
		});

		const { user: seller } = await api.signUpEmail({
			body: {
				email: "seller@test.cz",
				name: "Seller",
				password: "12345678",
			},
		});

		const sellerId = seller.id;

		// Base time: 89 days ago (within 90 day cutoff)
		const baseTime = DateTime.now().minus({
			days: 89,
		});

		const result = await Effect.gen(function* () {
			// Create 5 active transactions (no end events)
			for (let i = 0; i < 5; i++) {
				yield* userEventCreateFx({
					userId: sellerId,
					scope: "foreign",
					source: "transaction",
					group: `tx-${i}`,
					event: "transaction.create",
					isTerminal: false,
				}).pipe(
					Effect.provideService(DateContextFx, {
						now() {
							return baseTime.plus({
								days: i * 10,
							});
						},
					}),
				);
			}

			return yield* userEventSellerInfoFx({
				userId: sellerId,
			});
		}).pipe(withKyselyFx(database), withDateFx, Effect.runPromise);

		expect(result).not.toBeNull();
		if (!result) return;

		// Load: 5 active transactions > 3 = high
		expect(result.load.bucket).toBe("high");
	});
});
