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
		const { api } = auth(() => database.dialect);

		return Effect.gen(function* () {
			const seller = yield* createUsersFx({
				api,
				slug: "seller-load-high",
			});

			yield* seedUserEventTimelineFx({
				userId: seller.seller.id,
				events: createLoadEvents({
					userId: seller.seller.id,
					activeTransactions: 4,
				}),
			});

			const result = yield* userEventSellerInfoFx({
				userId: seller.seller.id,
			});

			expect(result?.load.bucket).toBe("high");
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});

	it("derives medium and low seller load buckets", async () => {
		const database = await testabase("userEventSellerInfoFx-load-medium-low");
		const { api } = auth(() => database.dialect);

		return Effect.gen(function* () {
			const { seller: mediumSeller, buyer: lowSeller } = yield* createUsersFx({
				api,
				slug: "seller-load-medium-low",
			});

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

	it("derives seller activity buckets", async () => {
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
