import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { inboxArchiveFx } from "~/@user/inbox/fx/inboxArchiveFx";
import { auth } from "~/auth/auth";
import type { InboxPriorityEnumSchema } from "~/database/@enum/InboxPriorityEnumSchema";
import type { InboxTypeEnumSchema } from "~/database/@enum/InboxTypeEnumSchema";
import type { InboxTableSchema } from "~/database/@table/InboxTableSchema/InboxTableSchema";
import { withRuntimeFx } from "~test/fixture/transactionFixture";
import { testabase } from "~test/testabase";

/**
 * Inserts inbox rows directly into the DB — bypasses inboxCreateFx so tests
 * are not coupled to the full transaction/listing lifecycle.
 */
const seedInbox = async (
	database: Awaited<ReturnType<typeof import("~test/testabase").testabase>>,
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

		const { user } = await api.signUpEmail({
			body: {
				email: "user@inbox-archive-cursor.cz",
				name: "User",
				password: "12345678",
			},
		});

		await seedInbox(database, [
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
		]);

		// Archive with cursor size 2 — only 2 should be archived
		await Effect.gen(function* () {
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
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		const archived = await database.kysely
			.selectFrom("inbox")
			.select("archivedAt")
			.where("userId", "=", user.id)
			.execute();

		const archivedCount = archived.filter((i) => i.archivedAt !== null).length;
		const activeCount = archived.filter((i) => i.archivedAt === null).length;

		expect(archivedCount).toBe(2);
		expect(activeCount).toBe(1);
	});
});
