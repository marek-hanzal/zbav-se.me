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
	it("derives medium and low seller load buckets", async () => {
		const database = await testabase("userEventSellerInfoFx-load-medium-low");

		return Effect.gen(function* () {
			const mediumSeller = yield* leaseTestUserFx({});
			const lowSeller = yield* leaseTestUserFx({});

			yield* seedUserEventTimelineFx({
				userId: mediumSeller.id,
				events: createLoadEvents({
					userId: mediumSeller.id,
					activeTransactions: 3,
				}),
			});
			yield* seedUserEventTimelineFx({
				userId: lowSeller.id,
				events: [
					...createLoadEvents({
						userId: lowSeller.id,
						activeTransactions: 1,
					}),
					...createTransactionTimeline({
						group: `tx-${lowSeller.id}-0`,
						steps: [
							{
								at: DateTime.now().minus({
									days: 2,
								}),
								scope: "user",
								event: "transaction.message",
								isTerminal: false,
							},
						],
					}),
				],
			});

			const medium = yield* userEventSellerInfoFx({
				userId: mediumSeller.id,
			});
			const low = yield* userEventSellerInfoFx({
				userId: lowSeller.id,
			});

			expect(medium?.load.bucket).toBe("medium");
			expect(low?.load.bucket).toBe("low");
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
