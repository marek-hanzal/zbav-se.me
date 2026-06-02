import { Effect } from "effect";
import { describe, it } from "vitest";
import { expectTaggedErrorFx } from "~/test/common/fx/expectTaggedErrorFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { activityFetchFx } from "~/user/activity/server/fx/activityFetchFx";

describe("activity read model", () => {
	it("denies foreign access", async () => {
		const database = await testabase("activityReadModelFx-fetch-foreign");

		return Effect.gen(function* () {
			const user = yield* leaseTestUserFx({});
			const stranger = yield* leaseTestUserFx({});

			yield* Effect.promise(() =>
				database.kysely
					.insertInto("activity")
					.values({
						id: "activity-read-foreign-item",
						userId: stranger.id,
						reference: [
							"listing-stranger",
							"tx-stranger",
						],
						family: "transaction",
						type: "buyer-message",
						payload: {
							transactionId: "tx-stranger",
							transactionEntryId: "entry-stranger",
						},
						priority: "high",
						timestamp: new Date("2026-04-01T13:00:00.000Z"),
						archivedAt: null,
					})
					.execute(),
			);

			const foreignFetch = yield* Effect.either(
				activityFetchFx({
					scope: {
						userId: user.id,
					},
					where: {
						id: "activity-read-foreign-item",
					},
				}),
			);

			expectTaggedErrorFx(foreignFetch, {
				tag: "NotFoundErrorFx",
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
