import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { userEventSellerInfoFx } from "~/buyer/user-event/server/fx/userEventSellerInfoFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { createTransactionTimeline } from "~/test/user-event/fx/createTransactionTimeline";
import { seedUserEventTimelineFx } from "~/test/user-event/fx/seedUserEventTimelineFx";

interface SeedSellerEventsProps {
	userId: string;
	activeTransactions: number;
	lastActionDaysAgo: number;
	withUserAction?: boolean;
}

const createLoadEvents = ({
	activeTransactions,
	userId,
}: Pick<SeedSellerEventsProps, "activeTransactions" | "userId">) =>
	Array.from({
		length: activeTransactions,
	}).flatMap((_, index) =>
		createTransactionTimeline({
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
		const database = await testabase("userEventSellerInfoFx-load-high");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});

			yield* seedUserEventTimelineFx({
				userId: seller.id,
				events: createLoadEvents({
					userId: seller.id,
					activeTransactions: 4,
				}),
			});

			const result = yield* userEventSellerInfoFx({
				userId: seller.id,
			});

			expect(result?.load.bucket).toBe("high");
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
