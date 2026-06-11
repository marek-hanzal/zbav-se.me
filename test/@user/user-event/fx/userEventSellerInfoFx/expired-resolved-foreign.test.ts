import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { withDateServiceFx } from "@/lib/common/date";
import { userEventSellerInfoFx } from "~/buyer/user-event/server/fx/userEventSellerInfoFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { userEventCreateFx } from "~/user/user-event/server/fx/userEventCreateFx";

describe("userEventSellerInfoFx", () => {
	it("Expired: counts foreign transaction.resolved when seller did not act after buyer ping", async () => {
		const database = await testabase("userEventSellerInfoFx-expired-resolved-foreign");
		const base = DateTime.now().minus({
			days: 20,
		});

		// tx-1: buyer create (ping), no seller action, buyer ends as "resolved" -> expired++
		const t1Create = base;
		const t1Resolved = t1Create.plus({
			days: 2,
		});

		// tx-2: buyer create (ping), seller acts (message) after ping, buyer ends as "resolved" -> NOT expired
		const t2Create = base.plus({
			days: 1,
		});
		const t2SellerMessage = t2Create.plus({
			hours: 1,
		});
		const t2Resolved = t2SellerMessage.plus({
			days: 2,
		});

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});

			const sellerId = seller.id;

			// tx-1
			yield* userEventCreateFx({
				userId: sellerId,
				scope: "foreign",
				source: "transaction",
				group: "tx-1",
				event: "transaction.create",
				isTerminal: false,
			}).pipe(
				withDateServiceFx({
					now: () => t1Create,
				}),
			);

			yield* userEventCreateFx({
				userId: sellerId,
				scope: "foreign",
				source: "transaction",
				group: "tx-1",
				event: "transaction.resolved",
				isTerminal: true,
			}).pipe(
				withDateServiceFx({
					now: () => t1Resolved,
				}),
			);

			// tx-2
			yield* userEventCreateFx({
				userId: sellerId,
				scope: "foreign",
				source: "transaction",
				group: "tx-2",
				event: "transaction.create",
				isTerminal: false,
			}).pipe(
				withDateServiceFx({
					now: () => t2Create,
				}),
			);

			yield* userEventCreateFx({
				userId: sellerId,
				scope: "user",
				source: "transaction",
				group: "tx-2",
				event: "transaction.message",
				isTerminal: false,
			}).pipe(
				withDateServiceFx({
					now: () => t2SellerMessage,
				}),
			);

			yield* userEventCreateFx({
				userId: sellerId,
				scope: "foreign",
				source: "transaction",
				group: "tx-2",
				event: "transaction.resolved",
				isTerminal: true,
			}).pipe(
				withDateServiceFx({
					now: () => t2Resolved,
				}),
			);

			const result = yield* userEventSellerInfoFx({
				userId: sellerId,
			});

			expect(result).not.toBeNull();
			if (!result) return;

			expect(result.expired.total).toBe(2);
			expect(result.expired.expired).toBe(1);
			expect(result.expired.percent).toBe(50);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
