import { createDateContext, DateContextLayer } from "@use-pico/common/date";
import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { userEventBuyerInfoFx } from "~/app/user-event/fx/userEventBuyerInfoFx";
import { userEventCreateFx } from "~/app/user-event/fx/userEventCreateFx";
import { auth } from "~/auth/auth";
import { KyselyContextLayer } from "~/database/context/KyselyContextLayer";
import { testabase } from "../../../../testabase";

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
		const tCreate = DateTime.now().minus({ days: 10 });
		const tSellerClose = tCreate.plus({ hours: 1 });

		// second group to ensure we have > 1 event overall
		const t2Create = DateTime.now().minus({ days: 9 });
		const t2SellerReject = t2Create.plus({ hours: 1 });

		const result = await Effect.gen(function* () {
			yield* userEventCreateFx({
				userId: buyerId,
				scope: "user",
				source: "transaction",
				group: "tx-1",
				event: "transaction.create",
				isTerminal: false,
			}).pipe(Effect.provide(DateContextLayer({ now: () => tCreate })));

			// terminal before any open event exists
			yield* userEventCreateFx({
				userId: buyerId,
				scope: "foreign",
				source: "transaction",
				group: "tx-1",
				event: "transaction.closed",
				isTerminal: true,
			}).pipe(Effect.provide(DateContextLayer({ now: () => tSellerClose })));

			yield* userEventCreateFx({
				userId: buyerId,
				scope: "user",
				source: "transaction",
				group: "tx-2",
				event: "transaction.create",
				isTerminal: false,
			}).pipe(Effect.provide(DateContextLayer({ now: () => t2Create })));

			yield* userEventCreateFx({
				userId: buyerId,
				scope: "foreign",
				source: "transaction",
				group: "tx-2",
				event: "transaction.rejected",
				isTerminal: true,
			}).pipe(Effect.provide(DateContextLayer({ now: () => t2SellerReject })));

			return yield* userEventBuyerInfoFx({
				userId: buyerId,
			});
		}).pipe(
			Effect.provide(KyselyContextLayer(database)),
			Effect.provide(DateContextLayer(createDateContext())),
			Effect.runPromise,
		);

		expect(result).not.toBeNull();
		if (!result) return;

		expect(result.reaction.total).toBe(2);
		expect(result.reaction.reactions).toBe(0);
		expect(result.reaction.terminal).toBe(2);
		expect(result.reaction.percent).toBe(100);
	});
});
