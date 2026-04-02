import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import type { InboxPriorityEnumSchema } from "~/common/inbox/enum/InboxPriorityEnumSchema";
import type { InboxTypeEnumSchema } from "~/common/inbox/enum/InboxTypeEnumSchema";
import { auth } from "~/server/auth/auth";
import type { InboxTableSchema } from "~/server/database/@table/InboxTableSchema";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
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
	it("cursor size limits how many items are archived in one call", async () => {
		const database = await testabase("inboxArchive-cursor-limit");
		const { api } = auth(() => database.dialect);

		return Effect.gen(function* () {
			const { user } = yield* Effect.promise(() =>
				api.signUpEmail({
					body: {
						email: "user@inbox-archive-cursor.cz",
						name: "User",
						password: "12345678",
					},
				}),
			);

			yield* Effect.promise(() =>
				seedInbox(database, [
					{
						id: "cursor-1",
						userId: user.id,
						reference: [
							"listing-cursor",
						],
						family: "reaction",
						type: "favourite",
						payload: {
							listingId: "listing-cursor",
						},
						priority: "common",
					},
					{
						id: "cursor-2",
						userId: user.id,
						reference: [
							"listing-cursor",
						],
						family: "reaction",
						type: "favourite",
						payload: {
							listingId: "listing-cursor",
						},
						priority: "common",
					},
					{
						id: "cursor-3",
						userId: user.id,
						reference: [
							"listing-cursor",
						],
						family: "reaction",
						type: "favourite",
						payload: {
							listingId: "listing-cursor",
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
					reference: "listing-cursor",
				},
				cursor: {
					page: 0,
					size: 2,
				},
			});

			const archived = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("inbox")
					.select("archivedAt")
					.where("userId", "=", user.id)
					.execute(),
			);

			const archivedCount = archived.filter((i) => i.archivedAt !== null).length;
			const activeCount = archived.filter((i) => i.archivedAt === null).length;

			expect(archivedCount).toBe(2);
			expect(activeCount).toBe(1);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
