import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { userEventBuyerInfoFx } from "~/seller/user-event/server/fx/userEventBuyerInfoFx";
import { auth } from "~/server/auth/auth";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createUserFx } from "~/test/user/fx/createUserFx";
import { createTransactionTimelineFx } from "~/test/user-event/fx/createTransactionTimelineFx";
import { seedUserEventTimelineFx } from "~/test/user-event/fx/seedUserEventTimelineFx";

describe("userEventBuyerInfoFx", () => {
	it("Improved buyer - earlier misses are outweighed by recent healthy decisions", async () => {
		const database = await testabase("userEventBuyerInfoFx-improved-buyer");
		const { api } = auth(() => database.dialect);

		return Effect.gen(function* () {
			const buyer = yield* createUserFx({
				api,
				email: "buyer@test.cz",
				name: "Buyer",
			});

			yield* seedUserEventTimelineFx({
				userId: buyer.id,
				events: [
					...createTransactionTimelineFx({
						group: "tx-1",
						steps: [
							{
								at: DateTime.now().minus({
									days: 80,
								}),
								scope: "user",
								event: "transaction.create",
								isTerminal: false,
							},
							{
								at: DateTime.now()
									.minus({
										days: 80,
									})
									.plus({
										hours: 1,
									}),
								scope: "foreign",
								event: "transaction.open",
								isTerminal: false,
							},
							{
								at: DateTime.now()
									.minus({
										days: 80,
									})
									.plus({
										hours: 1,
										minutes: 2,
									}),
								scope: "user",
								event: "transaction.closed",
								isTerminal: true,
							},
						],
					}),
					...createTransactionTimelineFx({
						group: "tx-2",
						steps: [
							{
								at: DateTime.now().minus({
									days: 70,
								}),
								scope: "user",
								event: "transaction.create",
								isTerminal: false,
							},
							{
								at: DateTime.now()
									.minus({
										days: 70,
									})
									.plus({
										hours: 2,
									}),
								scope: "foreign",
								event: "transaction.open",
								isTerminal: false,
							},
							{
								at: DateTime.now().minus({
									days: 65,
								}),
								scope: "foreign",
								event: "transaction.expired",
								isTerminal: true,
							},
						],
					}),
					...createTransactionTimelineFx({
						group: "tx-3",
						steps: [
							{
								at: DateTime.now().minus({
									days: 20,
								}),
								scope: "user",
								event: "transaction.create",
								isTerminal: false,
							},
							{
								at: DateTime.now()
									.minus({
										days: 20,
									})
									.plus({
										minutes: 30,
									}),
								scope: "foreign",
								event: "transaction.open",
								isTerminal: false,
							},
							{
								at: DateTime.now()
									.minus({
										days: 20,
									})
									.plus({
										minutes: 40,
									}),
								scope: "user",
								event: "transaction.message",
								isTerminal: false,
							},
							{
								at: DateTime.now().minus({
									days: 18,
								}),
								scope: "user",
								event: "transaction.success",
								isTerminal: true,
							},
						],
					}),
					...createTransactionTimelineFx({
						group: "tx-4",
						steps: [
							{
								at: DateTime.now().minus({
									days: 5,
								}),
								scope: "user",
								event: "transaction.create",
								isTerminal: false,
							},
							{
								at: DateTime.now()
									.minus({
										days: 5,
									})
									.plus({
										minutes: 5,
									}),
								scope: "foreign",
								event: "transaction.open",
								isTerminal: false,
							},
							{
								at: DateTime.now()
									.minus({
										days: 5,
									})
									.plus({
										minutes: 10,
									}),
								scope: "user",
								event: "transaction.message",
								isTerminal: false,
							},
							{
								at: DateTime.now().minus({
									days: 4,
								}),
								scope: "user",
								event: "transaction.success",
								isTerminal: true,
							},
						],
					}),
					...createTransactionTimelineFx({
						group: "tx-5",
						steps: [
							{
								at: DateTime.now().minus({
									days: 2,
								}),
								scope: "user",
								event: "transaction.create",
								isTerminal: false,
							},
							{
								at: DateTime.now()
									.minus({
										days: 2,
									})
									.plus({
										minutes: 10,
									}),
								scope: "foreign",
								event: "transaction.open",
								isTerminal: false,
							},
							{
								at: DateTime.now()
									.minus({
										days: 2,
									})
									.plus({
										minutes: 20,
									}),
								scope: "user",
								event: "transaction.message",
								isTerminal: false,
							},
							{
								at: DateTime.now().minus({
									days: 1,
								}),
								scope: "user",
								event: "transaction.closed",
								isTerminal: true,
							},
						],
					}),
				],
			});

			const result = yield* userEventBuyerInfoFx({
				userId: buyer.id,
			});

			expect(result).not.toBeNull();
			if (!result) return;

			expect(result.reaction.total).toBe(5);
			expect(result.decision.total).toBe(5);
			expect(result.activity.bucket).toBe("high");
			expect(result.expired.percent).toBeLessThanOrEqual(20);
			expect(result.score.score).toBeGreaterThanOrEqual(70);
			expect(result.score.rank).toBeGreaterThanOrEqual(5);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
