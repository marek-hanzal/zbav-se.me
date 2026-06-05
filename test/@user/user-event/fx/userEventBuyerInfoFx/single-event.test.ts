import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { DateServiceFx } from "@/lib/common/date";
import { userEventBuyerInfoFx } from "~/seller/user-event/server/fx/userEventBuyerInfoFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { userEventCreateFx } from "~/user/user-event/server/fx/userEventCreateFx";

describe("userEventBuyerInfoFx", () => {
	it("Single event returns nothing", async () => {
		const database = await testabase("userEventBuyerInfoFx-single-event");

		return Effect.gen(function* () {
			const buyer = yield* leaseTestUserFx({});

			yield* userEventCreateFx({
				userId: buyer.id,
				scope: "user",
				source: "transaction",
				group: "tx-1",
				event: "transaction.create",
				isTerminal: false,
			}).pipe(
				Effect.provideService(DateServiceFx, {
					now() {
						return DateTime.now().minus({
							days: 10,
						});
					},
				}),
			);

			const result = yield* userEventBuyerInfoFx({
				userId: buyer.id,
			});

			expect(result).toBeNull();
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
