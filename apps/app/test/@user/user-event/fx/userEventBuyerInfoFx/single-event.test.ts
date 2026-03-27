import { DateContextFx } from "@use-pico/common/date";
import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { userEventBuyerInfoFx } from "~/server/@seller/user-event/fx/userEventBuyerInfoFx";
import { userEventCreateFx } from "~/server/@user/user-event/fx/userEventCreateFx";
import { auth } from "~/server/auth/auth";
import { withDateFx } from "~/server/database/fx/withDateFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { testabase } from "~/test/testabase";

describe("userEventBuyerInfoFx", () => {
	it("Single event returns nothing", async () => {
		const database = await testabase("userEventBuyerInfoFx-single-event");

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

		const result = await Effect.gen(function* () {
			yield* userEventCreateFx({
				userId: buyer.id,
				scope: "user",
				source: "transaction",
				group: "tx-1",
				event: "transaction.create",
				isTerminal: false,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now() {
						return DateTime.now().minus({
							days: 10,
						});
					},
				}),
			);

			return yield* userEventBuyerInfoFx({
				userId: buyer.id,
			});
		}).pipe(withKyselyFx(database), withDateFx, Effect.runPromise);

		expect(result).toBeNull();
	});
});
