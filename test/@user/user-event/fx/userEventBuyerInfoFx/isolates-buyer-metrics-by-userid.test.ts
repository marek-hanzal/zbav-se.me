import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { DateContextFx } from "@/lib/common/date";
import { userEventBuyerInfoFx } from "~/seller/user-event/server/fx/userEventBuyerInfoFx";
import { auth } from "~/server/auth/auth";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { userEventCreateFx } from "~/user/user-event/server/fx/userEventCreateFx";

describe("userEventBuyerInfoFx", () => {
	it("isolates buyer metrics by userId and does not mix other buyers' events", async () => {
		const database = await testabase("userEventBuyerInfoFx-isolation");
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

			const { user: buyerA } = yield* signUp("buyer-a-events@test.cz", "Buyer A");
			const { user: buyerB } = yield* signUp("buyer-b-events@test.cz", "Buyer B");

			yield* userEventCreateFx({
				userId: buyerA.id,
				scope: "user",
				source: "transaction",
				group: "buyer-a-group",
				event: "transaction.create",
				isTerminal: false,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now: () =>
						DateTime.now().minus({
							days: 10,
						}),
				}),
			);
			yield* userEventCreateFx({
				userId: buyerA.id,
				scope: "user",
				source: "transaction",
				group: "buyer-a-group",
				event: "transaction.message",
				isTerminal: false,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now: () =>
						DateTime.now().minus({
							days: 9,
						}),
				}),
			);

			yield* userEventCreateFx({
				userId: buyerB.id,
				scope: "user",
				source: "transaction",
				group: "buyer-b-group",
				event: "transaction.create",
				isTerminal: false,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now: () =>
						DateTime.now().minus({
							days: 8,
						}),
				}),
			);

			const buyerAInfo = yield* userEventBuyerInfoFx({
				userId: buyerA.id,
			});
			const buyerBInfo = yield* userEventBuyerInfoFx({
				userId: buyerB.id,
			});

			expect(buyerAInfo).not.toBeNull();
			expect(buyerAInfo?.reaction.total).toBe(1);
			expect(buyerBInfo).toBeNull();
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
