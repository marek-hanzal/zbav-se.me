import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { DateContextFx } from "@/lib/common/date";
import { userEventBuyerInfoFx } from "~/seller/user-event/server/fx/userEventBuyerInfoFx";
import { auth } from "~/server/auth/auth";
import { testabase } from "~/test/testabase";
import { withRuntimeFx } from "~/test/utils/withRuntimeFx";
import { userEventCreateFx } from "~/user/user-event/server/fx/userEventCreateFx";

describe("userEventBuyerInfoFx", () => {
	it("Load calculation - high bucket with 4+ active transactions", async () => {
		const database = await testabase("userEventBuyerInfoFx-load-calculation-high");

		const { api } = auth(() => {
			return database.dialect;
		});

		return Effect.gen(function* () {
			const { user: buyer } = yield* Effect.promise(() =>
				api.signUpEmail({
					body: {
						email: "buyer@test.cz",
						name: "Buyer",
						password: "12345678",
					},
				}),
			);

			const buyerId = buyer.id;
			const baseTime = DateTime.now().minus({
				days: 30,
			});

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

			const result = yield* userEventBuyerInfoFx({
				userId: buyerId,
			});

			expect(result).not.toBeNull();
			if (!result) return;

			expect(result.load.bucket).toBe("high");
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
