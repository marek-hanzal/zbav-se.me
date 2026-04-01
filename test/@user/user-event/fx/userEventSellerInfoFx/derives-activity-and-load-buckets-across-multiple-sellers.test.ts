import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { DateContextFx } from "@/lib/common/date";
import { userEventSellerInfoFx } from "~/buyer/user-event/server/fx/userEventSellerInfoFx";
import { auth } from "~/server/auth/auth";
import { testabase } from "~/test/testabase";
import { withRuntimeFx } from "~/test/utils/withRuntimeFx";
import { userEventCreateFx } from "~/user/user-event/server/fx/userEventCreateFx";

describe("userEventSellerInfoFx", () => {
	it("derives seller activity and load buckets across multiple sellers without separate microtests", async () => {
		const database = await testabase("userEventSellerInfoFx-bucket-derivation");
		const { api } = auth(() => database.dialect);

		return Effect.gen(function* () {
			const signUp = (email: string, name: string) =>
				Effect.promise(() =>
					api.signUpEmail({
						body: {
							email,
							name,
							password: "12345678",
						},
					}),
				);

			const { user: highSeller } = yield* signUp("seller-high@test.cz", "Seller High");
			const { user: mediumSeller } = yield* signUp("seller-medium@test.cz", "Seller Medium");
			const { user: lowSeller } = yield* signUp("seller-low@test.cz", "Seller Low");
			const { user: noActivitySeller } = yield* signUp(
				"seller-none@test.cz",
				"Seller No Activity",
			);

			const seedSeller = ({
				userId,
				activeTransactions,
				lastActionDaysAgo,
				withUserAction = true,
			}: {
				userId: string;
				activeTransactions: number;
				lastActionDaysAgo: number;
				withUserAction?: boolean;
			}) =>
				Effect.gen(function* () {
					for (let index = 0; index < activeTransactions; index++) {
						const group = `tx-${userId}-${index}`;

						yield* userEventCreateFx({
							userId,
							scope: "foreign",
							source: "transaction",
							group,
							event: "transaction.create",
							isTerminal: false,
						}).pipe(
							Effect.provideService(DateContextFx, {
								now: () =>
									DateTime.now().minus({
										days: lastActionDaysAgo + 5 + index,
									}),
							}),
						);
					}

					if (!withUserAction) return;

					yield* userEventCreateFx({
						userId,
						scope: "user",
						source: "transaction",
						group: `tx-${userId}-activity`,
						event: "transaction.message",
						isTerminal: false,
					}).pipe(
						Effect.provideService(DateContextFx, {
							now: () =>
								DateTime.now().minus({
									days: lastActionDaysAgo,
								}),
						}),
					);
				});

			yield* seedSeller({
				userId: highSeller.id,
				activeTransactions: 5,
				lastActionDaysAgo: 5,
			});
			yield* seedSeller({
				userId: mediumSeller.id,
				activeTransactions: 3,
				lastActionDaysAgo: 45,
			});
			yield* seedSeller({
				userId: lowSeller.id,
				activeTransactions: 1,
				lastActionDaysAgo: 75,
			});
			yield* seedSeller({
				userId: noActivitySeller.id,
				activeTransactions: 2,
				lastActionDaysAgo: 20,
				withUserAction: false,
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
