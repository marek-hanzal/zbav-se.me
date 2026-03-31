import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { DateContextFx } from "@/lib/common/date";
import { userEventBuyerInfoFx } from "~/seller/user-event/server/fx/userEventBuyerInfoFx";
import { auth } from "~/server/auth/auth";
import { withDateFx } from "~/server/database/fx/withDateFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { testabase } from "~/test/testabase";
import { userEventCreateFx } from "~/user/user-event/server/fx/userEventCreateFx";

describe("userEventBuyerInfoFx", () => {
	it("Reaction: seller terminal before open counts as terminal reaction", async () => {
		const database = await testabase("userEventBuyerInfoFx-reaction-terminal-before-open");

		const { api } = auth(() => {
			return database.dialect;
		});

		const { user: buyer } = await api.signUpEmail({
			body: {
				email: "buyer@test.cz",
				name: "Buyer",
				password: "12345678",
			},
		});

		const buyerId = buyer.id;
		const tCreate = DateTime.now().minus({
			days: 10,
		});
		const tSellerClose = tCreate.plus({
			hours: 1,
		});

		// second group to ensure we have > 1 event overall
		const t2Create = DateTime.now().minus({
			days: 9,
		});
		const t2SellerReject = t2Create.plus({
			hours: 1,
		});

		const result = await Effect.gen(function* () {
			yield* userEventCreateFx({
				userId: buyerId,
				scope: "user",
				source: "transaction",
				group: "tx-1",
				event: "transaction.create",
				isTerminal: false,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now: () => tCreate,
				}),
			);

			// terminal before any open event exists
			yield* userEventCreateFx({
				userId: buyerId,
				scope: "foreign",
				source: "transaction",
				group: "tx-1",
				event: "transaction.closed",
				isTerminal: true,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now: () => tSellerClose,
				}),
			);

			yield* userEventCreateFx({
				userId: buyerId,
				scope: "user",
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
				userId: buyerId,
				scope: "foreign",
				source: "transaction",
				group: "tx-2",
				event: "transaction.rejected",
				isTerminal: true,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now: () => t2SellerReject,
				}),
			);

			return yield* userEventBuyerInfoFx({
				userId: buyerId,
			});
		}).pipe(withKyselyFx(database), withDateFx, Effect.runPromise);

		expect(result).not.toBeNull();
		if (!result) return;

		expect(result.reaction.total).toBe(2);
		expect(result.reaction.reactions).toBe(0);
		expect(result.reaction.terminal).toBe(2);
		expect(result.reaction.percent).toBe(100);
	});
});
