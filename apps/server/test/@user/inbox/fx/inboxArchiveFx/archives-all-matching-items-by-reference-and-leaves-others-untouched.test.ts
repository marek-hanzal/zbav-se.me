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
	it("archives all matching items by reference and leaves others untouched", async () => {
		const database = await testabase("inboxArchive-by-reference");
		const { api } = auth(() => database.dialect);

		const { user } = await api.signUpEmail({
			body: {
				email: "user@inbox-archive-ref.cz",
				name: "User",
				password: "12345678",
			},
		});

		await seedInbox(database, [
			{
				id: "arch-ref-a1",
				userId: user.id,
				reference: [
					"listing-a",
					"tx-1",
				],
				family: "transaction",
				type: "buyer-message",
				payload: {
					transactionId: "tx-1",
				},
				priority: "high",
			},
			{
				id: "arch-ref-a2",
				userId: user.id,
				reference: [
					"listing-a",
					"tx-1",
				],
				family: "transaction",
				type: "seller-message",
				payload: {
					transactionId: "tx-1",
				},
				priority: "high",
			},
			{
				id: "arch-ref-b1",
				userId: user.id,
				reference: [
					"listing-b",
				],
				family: "reaction",
				type: "favourite",
				payload: {
					listingId: "listing-b",
				},
				priority: "common",
			},
		]);

		// Archive all items that reference "listing-a"
		await Effect.gen(function* () {
			yield* inboxArchiveFx({
				scope: {
					userId: user.id,
				},
				where: {
					reference: "listing-a",
				},
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		// listing-a items should now have archivedAt set
		const archivedItems = await database.kysely
			.selectFrom("inbox")
			.select([
				"id",
				"archivedAt",
			])
			.where("id", "in", [
				"arch-ref-a1",
				"arch-ref-a2",
			])
			.execute();

		expect(archivedItems.every((i) => i.archivedAt !== null)).toBe(true);

		// listing-b item must remain unarchived
		const untouched = await database.kysely
			.selectFrom("inbox")
			.select("archivedAt")
			.where("id", "=", "arch-ref-b1")
			.executeTakeFirstOrThrow();

		expect(untouched.archivedAt).toBeNull();
	});
});
