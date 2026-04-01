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
	it("isolates seller metrics by userId and does not mix other sellers' events", async () => {
		const database = await testabase("userEventSellerInfoFx-isolation");
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

			const { user: sellerA } = yield* signUp("seller-a-events@test.cz", "Seller A");
			const { user: sellerB } = yield* signUp("seller-b-events@test.cz", "Seller B");

			yield* userEventCreateFx({
				userId: sellerA.id,
				scope: "foreign",
				source: "transaction",
				group: "seller-a-group",
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
				userId: sellerA.id,
				scope: "user",
				source: "transaction",
				group: "seller-a-group",
				event: "transaction.open",
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
				userId: sellerB.id,
				scope: "foreign",
				source: "transaction",
				group: "seller-b-group",
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

			const sellerAInfo = yield* userEventSellerInfoFx({
				userId: sellerA.id,
			});
			const sellerBInfo = yield* userEventSellerInfoFx({
				userId: sellerB.id,
			});

			expect(sellerAInfo).not.toBeNull();
			expect(sellerAInfo?.reaction.total).toBe(1);
			expect(sellerBInfo).toBeNull();
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
