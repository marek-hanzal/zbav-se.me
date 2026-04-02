import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { userEventSellerInfoFx } from "~/buyer/user-event/server/fx/userEventSellerInfoFx";
import { auth } from "~/server/auth/auth";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createUserFx } from "~/test/user/fx/createUserFx";
import { createTransactionTimelineFx } from "~/test/user-event/fx/createTransactionTimelineFx";
import { seedUserEventTimelineFx } from "~/test/user-event/fx/seedUserEventTimelineFx";

describe("userEventSellerInfoFx", () => {
	it("Improved seller - old rejects are outweighed by recent quick resolutions", async () => {
		const database = await testabase("userEventSellerInfoFx-improved-seller");
		const { api } = auth(() => database.dialect);

		return Effect.gen(function* () {
			const seller = yield* createUserFx({
				api,
				email: "seller@test.cz",
				name: "Seller",
			});

			yield* seedUserEventTimelineFx({
				userId: seller.id,
				events: [
					...createTransactionTimelineFx({
						group: "tx-1",
						steps: [
							{
								at: DateTime.now().minus({
									days: 80,
								}),
								scope: "foreign",
								event: "transaction.create",
								isTerminal: false,
							},
							{
								at: DateTime.now().minus({
									days: 79,
								}),
								scope: "user",
								event: "transaction.rejected",
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
								scope: "foreign",
								event: "transaction.create",
								isTerminal: false,
							},
							{
								at: DateTime.now().minus({
									days: 67,
								}),
								scope: "foreign",
								event: "transaction.closed",
								isTerminal: true,
							},
						],
					}),
					...createTransactionTimelineFx({
						group: "tx-3",
						steps: [
							{
								at: DateTime.now().minus({
									days: 40,
								}),
								scope: "foreign",
								event: "transaction.create",
								isTerminal: false,
							},
							{
								at: DateTime.now()
									.minus({
										days: 40,
									})
									.plus({
										hours: 1,
									}),
								scope: "user",
								event: "transaction.open",
								isTerminal: false,
							},
							{
								at: DateTime.now().minus({
									days: 39,
								}),
								scope: "user",
								event: "transaction.resolved",
								isTerminal: true,
							},
						],
					}),
					...createTransactionTimelineFx({
						group: "tx-4",
						steps: [
							{
								at: DateTime.now().minus({
									days: 20,
								}),
								scope: "foreign",
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
								scope: "user",
								event: "transaction.message",
								isTerminal: false,
							},
							{
								at: DateTime.now().minus({
									days: 18,
								}),
								scope: "user",
								event: "transaction.resolved",
								isTerminal: true,
							},
						],
					}),
					...createTransactionTimelineFx({
						group: "tx-5",
						steps: [
							{
								at: DateTime.now().minus({
									days: 5,
								}),
								scope: "foreign",
								event: "transaction.create",
								isTerminal: false,
							},
							{
								at: DateTime.now()
									.minus({
										days: 5,
									})
									.plus({
										minutes: 15,
									}),
								scope: "user",
								event: "transaction.open",
								isTerminal: false,
							},
							{
								at: DateTime.now().minus({
									days: 4,
								}),
								scope: "user",
								event: "transaction.resolved",
								isTerminal: true,
							},
						],
					}),
					...createTransactionTimelineFx({
						group: "tx-6",
						steps: [
							{
								at: DateTime.now().minus({
									days: 1,
								}),
								scope: "foreign",
								event: "transaction.create",
								isTerminal: false,
							},
							{
								at: DateTime.now()
									.minus({
										days: 1,
									})
									.plus({
										hours: 2,
									}),
								scope: "user",
								event: "transaction.message",
								isTerminal: false,
							},
							{
								at: DateTime.now(),
								scope: "user",
								event: "transaction.resolved",
								isTerminal: true,
							},
						],
					}),
				],
			});

			const result = yield* userEventSellerInfoFx({
				userId: seller.id,
			});

			expect(result).not.toBeNull();
			if (!result) return;

			expect(result.reaction.percent).toBe(100);
			expect(result.rejected.percent).toBeCloseTo(16.67, 1);
			expect(result.resolved.resolved).toBe(4);
			expect(result.activity.bucket).toBe("high");
			expect(result.score.score).toBeGreaterThanOrEqual(70);
			expect(result.score.rank).toBeGreaterThanOrEqual(5);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
