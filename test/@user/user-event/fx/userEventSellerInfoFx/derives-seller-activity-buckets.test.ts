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

const _createLoadEvents = ({
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
	it("derives seller activity buckets", async () => {
		const database = await testabase("userEventSellerInfoFx-activity-derivation");

		return Effect.gen(function* () {
			const highSeller = yield* leaseTestUserFx({});
			const mediumSeller = yield* leaseTestUserFx({});
			const lowSeller = yield* leaseTestUserFx({});

			const seedSellerEvents = ({
				userId,
				activeTransactions,
				lastActionDaysAgo,
				withUserAction = true,
			}: SeedSellerEventsProps) => [
				...Array.from({
					length: activeTransactions,
				}).flatMap((_, index) =>
					createTransactionTimeline({
						group: `tx-${userId}-${index}`,
						steps: [
							{
								at: DateTime.now().minus({
									days: lastActionDaysAgo + 5 + index,
								}),
								scope: "foreign",
								event: "transaction.create",
								isTerminal: false,
							},
						],
					}),
				),
				...(withUserAction
					? createTransactionTimeline({
							group: `tx-${userId}-activity`,
							steps: [
								{
									at: DateTime.now().minus({
										days: lastActionDaysAgo,
									}),
									scope: "user",
									event: "transaction.message",
									isTerminal: false,
								},
							],
						})
					: []),
			];

			yield* seedUserEventTimelineFx({
				userId: highSeller.id,
				events: seedSellerEvents({
					userId: highSeller.id,
					activeTransactions: 1,
					lastActionDaysAgo: 5,
				}),
			});
			yield* seedUserEventTimelineFx({
				userId: mediumSeller.id,
				events: seedSellerEvents({
					userId: mediumSeller.id,
					activeTransactions: 1,
					lastActionDaysAgo: 45,
				}),
			});
			yield* seedUserEventTimelineFx({
				userId: lowSeller.id,
				events: seedSellerEvents({
					userId: lowSeller.id,
					activeTransactions: 1,
					lastActionDaysAgo: 75,
				}),
			});

			const high = yield* userEventSellerInfoFx({
				userId: highSeller.id,
			});
			const medium = yield* userEventSellerInfoFx({
				userId: mediumSeller.id,
			});
			const low = yield* userEventSellerInfoFx({
				userId: lowSeller.id,
			});

			expect(high?.activity.bucket).toBe("high");
			expect(medium?.activity.bucket).toBe("medium");
			expect(low?.activity.bucket).toBe("low");
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
