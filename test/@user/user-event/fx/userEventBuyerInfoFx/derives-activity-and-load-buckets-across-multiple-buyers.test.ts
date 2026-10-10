import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { withDateServiceFn } from "~/date/fn/withDateServiceFn";
import { userEventBuyerInfoFx } from "~/seller-user-event/fx/userEventBuyerInfoFx";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { userEventCreateFx } from "~/user-event/fx/userEventCreateFx";

describe("userEventBuyerInfoFx", () => {
	it("derives activity and load buckets across multiple buyers without separate microtests", async () => {
		const database = await testabaseFn("userEventBuyerInfoFx-bucket-derivation");

		return Effect.gen(function* () {
			const highBuyer = yield* leaseTestUserFx({});
			const mediumBuyer = yield* leaseTestUserFx({});
			const lowBuyer = yield* leaseTestUserFx({});

			const seedBuyerFx = ({
				userId,
				activeTransactions,
				lastActionDaysAgo,
			}: {
				userId: string;
				activeTransactions: number;
				lastActionDaysAgo: number;
			}) =>
				Effect.gen(function* () {
					for (let index = 0; index < activeTransactions; index++) {
						yield* userEventCreateFx({
							userId,
							scope: "user",
							source: "transaction",
							group: `tx-${userId}-${index}`,
							event: "transaction.create",
							isTerminal: false,
						}).pipe(
							withDateServiceFn({
								nowFn: () =>
									DateTime.now().minus({
										days: lastActionDaysAgo + 5 + index,
									}),
							}),
						);
					}

					yield* userEventCreateFx({
						userId,
						scope: "user",
						source: "transaction",
						group: `tx-${userId}-activity`,
						event: "transaction.message",
						isTerminal: false,
					}).pipe(
						withDateServiceFn({
							nowFn: () =>
								DateTime.now().minus({
									days: lastActionDaysAgo,
								}),
						}),
					);
				});

			yield* seedBuyerFx({
				userId: highBuyer.id,
				activeTransactions: 5,
				lastActionDaysAgo: 5,
			});
			yield* seedBuyerFx({
				userId: mediumBuyer.id,
				activeTransactions: 3,
				lastActionDaysAgo: 45,
			});
			yield* seedBuyerFx({
				userId: lowBuyer.id,
				activeTransactions: 1,
				lastActionDaysAgo: 75,
			});

			const high = yield* userEventBuyerInfoFx({
				userId: highBuyer.id,
			});
			const medium = yield* userEventBuyerInfoFx({
				userId: mediumBuyer.id,
			});
			const low = yield* userEventBuyerInfoFx({
				userId: lowBuyer.id,
			});

			expect(high?.load.bucket).toBe("high");
			expect(high?.activity.bucket).toBe("high");

			expect(medium?.load.bucket).toBe("medium");
			expect(medium?.activity.bucket).toBe("medium");

			expect(low?.load.bucket).toBe("low");
			expect(low?.activity.bucket).toBe("low");
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
