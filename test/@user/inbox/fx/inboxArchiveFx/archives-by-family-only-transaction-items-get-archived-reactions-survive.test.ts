import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import type { InboxPriorityEnumSchema } from "~/common/inbox/enum/InboxPriorityEnumSchema";
import type { InboxTypeEnumSchema } from "~/common/inbox/enum/InboxTypeEnumSchema";
import { auth } from "~/server/auth/auth";
import type { InboxTableSchema } from "~/server/database/@table/InboxTableSchema";
import { testabase } from "~/test/testabase";
import { withRuntimeFx } from "~/test/utils/withRuntimeFx";
import { inboxArchiveFx } from "~/user/inbox/server/fx/inboxArchiveFx";

/**
 * Inserts inbox rows directly into the DB — bypasses inboxCreateFx so tests
 * are not coupled to the full transaction/listing lifecycle.
 */
const seedInbox = async (
	database: Awaited<ReturnType<typeof import("~/test/testabase").testabase>>,
	rows: Array<
		Pick<InboxTableSchema.Type, "family" | "payload"> & {
			id: string;
			userId: string;
			reference: string[];
			type: InboxTypeEnumSchema.Type;
			priority: InboxPriorityEnumSchema.Type;
		}
	>,
) => {
	await database.kysely
		.insertInto("inbox")
		.values(
			rows.map((r) => ({
				...r,
				timestamp: new Date("2026-03-17T12:00:00.000Z"),
				archivedAt: null,
			})),
		)
		.execute();
};

describe("inboxArchiveFx", () => {
	it("archives by family: only transaction items get archived, reactions survive", async () => {
		const database = await testabase("inboxArchive-by-family");
		const { api } = auth(() => database.dialect);

		return Effect.gen(function* () {
			const { user } = yield* Effect.promise(() =>
				api.signUpEmail({
					body: {
						email: "user@inbox-archive-family.cz",
						name: "User",
						password: "12345678",
					},
				}),
			);

			yield* Effect.promise(() =>
				seedInbox(database, [
					{
						id: "family-tx",
						userId: user.id,
						reference: [
							"listing-x",
							"tx-x",
						],
						family: "transaction",
						type: "buyer-message",
						payload: {
							transactionId: "tx-x",
						},
						priority: "high",
					},
					{
						id: "family-reaction",
						userId: user.id,
						reference: [
							"listing-x",
						],
						family: "reaction",
						type: "favourite",
						payload: {
							listingId: "listing-x",
						},
						priority: "common",
					},
				]),
			);

			yield* inboxArchiveFx({
				scope: {
					userId: user.id,
				},
				where: {
					family: "transaction",
				},
			});

			const txItem = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("inbox")
					.select("archivedAt")
					.where("id", "=", "family-tx")
					.executeTakeFirstOrThrow(),
			);

			const reactionItem = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("inbox")
					.select("archivedAt")
					.where("id", "=", "family-reaction")
					.executeTakeFirstOrThrow(),
			);

			expect(txItem.archivedAt).not.toBeNull();
			expect(reactionItem.archivedAt).toBeNull();
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
