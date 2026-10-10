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

const _createLoadEventsFn = ({
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
	it("derives seller activity buckets", async () => {
		const database = await testabaseFn("userEventSellerInfoFx-activity-derivation");

		return Effect.gen(function* () {
			const highSeller = yield* leaseTestUserFx({});
			const mediumSeller = yield* leaseTestUserFx({});
			const lowSeller = yield* leaseTestUserFx({});

			const seedSellerEventsFn = ({
				userId,
				activeTransactions,
				lastActionDaysAgo,
				withUserAction = true,
			}: SeedSellerEventsProps) => [
				...Array.from({
					length: activeTransactions,
				}).flatMap((_, index) =>
					createTransactionTimelineFn({
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
					? createTransactionTimelineFn({
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
				events: seedSellerEventsFn({
					userId: highSeller.id,
					activeTransactions: 1,
					lastActionDaysAgo: 5,
				}),
			});
			yield* seedUserEventTimelineFx({
				userId: mediumSeller.id,
				events: seedSellerEventsFn({
					userId: mediumSeller.id,
					activeTransactions: 1,
					lastActionDaysAgo: 45,
				}),
			});
			yield* seedUserEventTimelineFx({
				userId: lowSeller.id,
				events: seedSellerEventsFn({
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
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
