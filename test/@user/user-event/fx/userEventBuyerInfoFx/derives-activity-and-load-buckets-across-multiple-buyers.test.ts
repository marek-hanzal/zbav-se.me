import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { DateServiceFx } from "@/lib/common/date";
import { userEventBuyerInfoFx } from "~/seller/user-event/server/fx/userEventBuyerInfoFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { userEventCreateFx } from "~/user/user-event/server/fx/userEventCreateFx";

describe("userEventBuyerInfoFx", () => {
	it("derives activity and load buckets across multiple buyers without separate microtests", async () => {
		const database = await testabase("userEventBuyerInfoFx-bucket-derivation");

		return Effect.gen(function* () {
			const highBuyer = yield* leaseTestUserFx({});
			const mediumBuyer = yield* leaseTestUserFx({});
			const lowBuyer = yield* leaseTestUserFx({});

			const seedBuyer = ({
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
							Effect.provideService(DateServiceFx, {
								now: () =>
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
						Effect.provideService(DateServiceFx, {
							now: () =>
								DateTime.now().minus({
									days: lastActionDaysAgo,
								}),
						}),
					);
				});

			yield* seedBuyer({
				userId: highBuyer.id,
				activeTransactions: 5,
				lastActionDaysAgo: 5,
			});
			yield* seedBuyer({
				userId: mediumBuyer.id,
				activeTransactions: 3,
				lastActionDaysAgo: 45,
			});
			yield* seedBuyer({
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
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
