import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { userEventSellerInfoFx } from "~/buyer-user-event/fx/userEventSellerInfoFx";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { createTransactionTimelineFn } from "~/test/user-event/fx/createTransactionTimelineFn";
import { seedUserEventTimelineFx } from "~/test/user-event/fx/seedUserEventTimelineFx";

interface SeedSellerEventsProps {
	userId: string;
	activeTransactions: number;
	lastActionDaysAgo: number;
	withUserAction?: boolean;
}

const createLoadEventsFn = ({
	activeTransactions,
	userId,
}: Pick<SeedSellerEventsProps, "activeTransactions" | "userId">) =>
	Array.from({
		length: activeTransactions,
	}).flatMap((_, index) =>
		createTransactionTimelineFn({
			group: `tx-${userId}-${index}`,
			steps: [
				{
					at: DateTime.now().minus({
						days: 10 + index,
					}),
					scope: "foreign",
					event: "transaction.create",
					isTerminal: false,
				},
			],
		}),
	);

describe("userEventSellerInfoFx", {
	timeout: 4_000,
}, () => {
	it("derives high seller load bucket", async () => {
		const database = await testabaseFn("userEventSellerInfoFx-load-high");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});

			yield* seedUserEventTimelineFx({
				userId: seller.id,
				events: createLoadEventsFn({
					userId: seller.id,
					activeTransactions: 4,
				}),
			});

			const result = yield* userEventSellerInfoFx({
				userId: seller.id,
			});

			expect(result?.load.bucket).toBe("high");
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
