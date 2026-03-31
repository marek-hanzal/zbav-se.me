import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { DateContextFx } from "@/lib/common/date";
import { userEventSellerInfoFx } from "~/buyer/user-event/server/fx/userEventSellerInfoFx";
import { auth } from "~/server/auth/auth";
import { withDateFx } from "~/server/database/fx/withDateFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { testabase } from "~/test/testabase";
import { userEventCreateFx } from "~/user/user-event/server/fx/userEventCreateFx";

describe("userEventSellerInfoFx", () => {
	it("Resolved: counts foreign transaction.success as buyer-terminal for seller resolve", async () => {
		const database = await testabase("userEventSellerInfoFx-resolved-terminal-foreign-success");

		const { api } = auth(() => {
			return database.dialect;
		});

		const { user: seller } = await api.signUpEmail({
			body: {
				email: "seller@test.cz",
				name: "Seller",
				password: "12345678",
			},
		});

		const sellerId = seller.id;
		const base = DateTime.now().minus({
			days: 20,
		});

		// tx-1: buyer ends as success -> terminal++
		const t1Create = base;
		const t1BuyerSuccess = t1Create.plus({
			days: 2,
		});

		// tx-2: seller resolves explicitly -> resolved++
		const t2Create = base.plus({
			days: 1,
		});
		const t2SellerResolve = t2Create.plus({
			days: 3,
		});

		const result = await Effect.gen(function* () {
			yield* userEventCreateFx({
				userId: sellerId,
				scope: "foreign",
				source: "transaction",
				group: "tx-1",
				event: "transaction.create",
				isTerminal: false,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now: () => t1Create,
				}),
			);

			yield* userEventCreateFx({
				userId: sellerId,
				scope: "foreign",
				source: "transaction",
				group: "tx-1",
				event: "transaction.success",
				isTerminal: true,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now: () => t1BuyerSuccess,
				}),
			);

			yield* userEventCreateFx({
				userId: sellerId,
				scope: "foreign",
				source: "transaction",
				group: "tx-2",
				event: "transaction.create",
				isTerminal: false,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now: () => t2Create,
				}),
			);

			yield* userEventCreateFx({
				userId: sellerId,
				scope: "user",
				source: "transaction",
				group: "tx-2",
				event: "transaction.resolved",
				isTerminal: true,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now: () => t2SellerResolve,
				}),
			);

			return yield* userEventSellerInfoFx({
				userId: sellerId,
			});
		}).pipe(withKyselyFx(database), withDateFx, Effect.runPromise);

		expect(result).not.toBeNull();
		if (!result) return;

		expect(result.resolved.total).toBe(2);
		expect(result.resolved.resolved).toBe(1);
		expect(result.resolved.terminal).toBe(1);
		expect(result.resolved.percent).toBe(50);
	});
});
