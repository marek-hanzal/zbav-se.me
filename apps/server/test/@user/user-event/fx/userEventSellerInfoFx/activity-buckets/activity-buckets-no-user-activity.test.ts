import { DateContextFx } from "@use-pico/common/date";
import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { userEventSellerInfoFx } from "~/@buyer/user-event/fx/userEventSellerInfoFx";
import { userEventCreateFx } from "~/@user/user-event/fx/userEventCreateFx";
import { auth } from "~/auth/auth";
import { withDateFx } from "~/database/fx/withDateFx";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { testabase } from "~test/testabase";
import { withTestRuntimeFx } from "~test/withTestRuntimeFx";

describe("userEventSellerInfoFx", () => {
	it("Activity buckets - no user activity", async () => {
		const database = await testabase("userEventSellerInfoFx-activity-none");

		const { api } = auth(() => {
			return database.dialect;
		});

		const { user: seller } = await api.signUpEmail({
			body: {
				email: "seller4@test.cz",
				name: "Seller",
				password: "12345678",
			},
		});

		const sellerId = seller.id;

		// No user scope events = low activity

		const result = await Effect.gen(function* () {
			// Create two transactions (need > 1 event) with only foreign events (buyer creates)
			const createTime1 = DateTime.now().minus({
				days: 10,
			});

			yield* userEventCreateFx({
				userId: sellerId,
				scope: "foreign",
				source: "transaction",
				group: "tx-1",
				event: "transaction.create",
				isTerminal: false,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now() {
						return createTime1;
					},
				}),
			);

			const createTime2 = DateTime.now().minus({
				days: 20,
			});

			yield* userEventCreateFx({
				userId: sellerId,
				scope: "foreign",
				source: "transaction",
				group: "tx-2",
				event: "transaction.create",
				isTerminal: false,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now() {
						return createTime2;
					},
				}),
			);

			return yield* userEventSellerInfoFx({
				userId: sellerId,
			});
		}).pipe(withKyselyFx(database), withDateFx, withTestRuntimeFx, Effect.runPromise);

		expect(result).not.toBeNull();
		if (!result) return;

		// Activity: No user events = low
		expect(result.activity.bucket).toBe("low");
	});
});
