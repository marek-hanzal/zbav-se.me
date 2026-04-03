import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { inboxCountFx } from "~/user/inbox/server/fx/inboxCountFx";
import { inboxFetchFx } from "~/user/inbox/server/fx/inboxFetchFx";
import { inboxPatchFx } from "~/user/inbox/server/fx/inboxPatchFx";

describe("inboxPatchFx", () => {
	it("patches a single item and exposes the updated state via fetch/count", async () => {
		const database = await testabase("inboxPatch-single");
		const archivedAt = new Date("2026-04-01T10:00:00.000Z");

		return Effect.gen(function* () {
			const user = yield* leaseTestUserFx({});
			const stranger = yield* leaseTestUserFx({});

			yield* Effect.promise(() =>
				database.kysely
					.insertInto("inbox")
					.values({
						id: "inbox-patch-1",
						userId: user.id,
						reference: [
							"listing-1",
							"tx-1",
						],
						family: "transaction",
						type: "buyer-message",
						payload: {
							transactionId: "tx-1",
							transactionEntryId: "entry-1",
						},
						priority: "high",
						timestamp: new Date("2026-04-01T09:00:00.000Z"),
						archivedAt: null,
					})
					.executeTakeFirstOrThrow(),
			);

			const patched = yield* inboxPatchFx({
				scope: {
					userId: user.id,
				},
				query: {
					where: {
						id: "inbox-patch-1",
					},
				},
				patch: {
					archivedAt,
				},
			});

			expect(patched.archivedAt?.toISOString()).toBe(archivedAt.toISOString());

			const fetched = yield* inboxFetchFx({
				scope: {
					userId: user.id,
				},
				where: {
					id: "inbox-patch-1",
				},
			});

			expect(fetched.archivedAt?.toISOString()).toBe(archivedAt.toISOString());

			const foreignFetch = yield* Effect.either(
				inboxFetchFx({
					scope: {
						userId: stranger.id,
					},
					where: {
						id: "inbox-patch-1",
					},
				}),
			);
			const foreignPatch = yield* Effect.either(
				inboxPatchFx({
					scope: {
						userId: stranger.id,
					},
					query: {
						where: {
							id: "inbox-patch-1",
						},
					},
					patch: {
						archivedAt: null,
					},
				}),
			);

			expect(foreignFetch._tag).toBe("Left");
			expect(foreignPatch._tag).toBe("Left");

			const activeCount = yield* inboxCountFx({
				scope: {
					userId: user.id,
				},
				filter: {
					archivedAtIsNull: true,
				},
			});

			expect(activeCount.filter).toBe(0);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
