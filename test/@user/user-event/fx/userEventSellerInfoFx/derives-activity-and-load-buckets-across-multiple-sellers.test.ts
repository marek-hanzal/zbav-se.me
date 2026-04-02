import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { userEventSellerInfoFx } from "~/buyer/user-event/server/fx/userEventSellerInfoFx";
import { auth } from "~/server/auth/auth";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createUserFx } from "~/test/user/fx/createUserFx";
import { createTransactionTimeline } from "~/test/user-event/fx/createTransactionTimeline";
import { seedUserEventTimelineFx } from "~/test/user-event/fx/seedUserEventTimelineFx";

interface SeedSellerEventsProps {
	userId: string;
	activeTransactions: number;
	lastActionDaysAgo: number;
	withUserAction?: boolean;
}

describe("userEventSellerInfoFx", () => {
	it("derives seller activity and load buckets across multiple sellers without separate microtests", async () => {
		const database = await testabase("userEventSellerInfoFx-bucket-derivation");
		const { api } = auth(() => database.dialect);

		return Effect.gen(function* () {
			const highSeller = yield* createUserFx({
				api,
				email: "seller-high@test.cz",
				name: "Seller High",
			});
			const mediumSeller = yield* createUserFx({
				api,
				email: "seller-medium@test.cz",
				name: "Seller Medium",
			});
			const lowSeller = yield* createUserFx({
				api,
				email: "seller-low@test.cz",
				name: "Seller Low",
			});
			const noActivitySeller = yield* createUserFx({
				api,
				email: "seller-none@test.cz",
				name: "Seller No Activity",
			});

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
					activeTransactions: 5,
					lastActionDaysAgo: 5,
				}),
			});
			yield* seedUserEventTimelineFx({
				userId: mediumSeller.id,
				events: seedSellerEvents({
					userId: mediumSeller.id,
					activeTransactions: 3,
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
			yield* seedUserEventTimelineFx({
				userId: noActivitySeller.id,
				events: seedSellerEvents({
					userId: noActivitySeller.id,
					activeTransactions: 2,
					lastActionDaysAgo: 20,
					withUserAction: false,
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
			const noActivity = yield* userEventSellerInfoFx({
				userId: noActivitySeller.id,
			});

			expect(high?.load.bucket).toBe("high");
			expect(high?.activity.bucket).toBe("high");

			expect(medium?.load.bucket).toBe("medium");
			expect(medium?.activity.bucket).toBe("medium");

			expect(low?.load.bucket).toBe("low");
			expect(low?.activity.bucket).toBe("low");

			expect(noActivity?.load.bucket).toBe("medium");
			expect(noActivity?.activity.bucket).toBe("low");
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
