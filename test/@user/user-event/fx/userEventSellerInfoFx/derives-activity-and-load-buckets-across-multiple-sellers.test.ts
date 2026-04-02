import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { userEventSellerInfoFx } from "~/buyer/user-event/server/fx/userEventSellerInfoFx";
import { auth } from "~/server/auth/auth";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { createTransactionTimeline } from "~/test/user-event/fx/createTransactionTimeline";
import { seedUserEventTimelineFx } from "~/test/user-event/fx/seedUserEventTimelineFx";

interface SeedSellerEventsProps {
	userId: string;
	activeTransactions: number;
	lastActionDaysAgo: number;
	withUserAction?: boolean;
}

describe("userEventSellerInfoFx", {
	timeout: 4_000,
}, () => {
	it("derives seller load buckets across multiple sellers", async () => {
		const database = await testabase("userEventSellerInfoFx-load-derivation");
		const { api } = auth(() => database.dialect);

		return Effect.gen(function* () {
			const {
				seller: highSeller,
				buyer: mediumSeller,
				stranger: lowSeller,
			} = yield* createUsersFx({
				api,
				slug: "seller-load-buckets",
			});

			const seedSellerEvents = ({
				userId,
				activeTransactions,
			}: Pick<SeedSellerEventsProps, "activeTransactions" | "userId">) => [
				...Array.from({
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
				),
				...createTransactionTimeline({
					group: `tx-${userId}-activity`,
					steps: [
						{
							at: DateTime.now().minus({
								days: 3,
							}),
							scope: "user",
							event: "transaction.message",
							isTerminal: false,
						},
					],
				}),
			];

			yield* seedUserEventTimelineFx({
				userId: highSeller.id,
				events: seedSellerEvents({
					userId: highSeller.id,
					activeTransactions: 5,
				}),
			});
			yield* seedUserEventTimelineFx({
				userId: mediumSeller.id,
				events: seedSellerEvents({
					userId: mediumSeller.id,
					activeTransactions: 3,
				}),
			});
			yield* seedUserEventTimelineFx({
				userId: lowSeller.id,
				events: seedSellerEvents({
					userId: lowSeller.id,
					activeTransactions: 1,
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

			expect(high?.load.bucket).toBe("high");
			expect(medium?.load.bucket).toBe("medium");
			expect(low?.load.bucket).toBe("low");
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});

	it("derives seller activity buckets and handles no recent user activity", async () => {
		const database = await testabase("userEventSellerInfoFx-activity-derivation");
		const { api } = auth(() => database.dialect);

		return Effect.gen(function* () {
			const {
				seller: highSeller,
				buyer: mediumSeller,
				stranger: lowSeller,
			} = yield* createUsersFx({
				api,
				slug: "seller-activity-buckets",
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

	it("handles seller activity when there is no recent user action", async () => {
		const database = await testabase("userEventSellerInfoFx-activity-none");
		const { api } = auth(() => database.dialect);

		return Effect.gen(function* () {
			const seller = yield* createUsersFx({
				api,
				slug: "seller-activity-none",
			}).pipe(Effect.map((users) => users.seller));

			yield* seedUserEventTimelineFx({
				userId: seller.id,
				events: [
					...Array.from({
						length: 2,
					}).flatMap((_, index) =>
						createTransactionTimeline({
							group: `tx-${seller.id}-no-activity-${index}`,
							steps: [
								{
									at: DateTime.now().minus({
										days: 25 + index,
									}),
									scope: "foreign",
									event: "transaction.create",
									isTerminal: false,
								},
							],
						}),
					),
				],
			});

			const noActivity = yield* userEventSellerInfoFx({
				userId: seller.id,
			});

			expect(noActivity?.load.bucket).toBe("medium");
			expect(noActivity?.activity.bucket).toBe("low");
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
