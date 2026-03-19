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
	it("scope isolation: user can only archive their own items", async () => {
		const database = await testabase("inboxArchive-scope-isolation");
		const { api } = auth(() => database.dialect);

		const { user: alice } = await api.signUpEmail({
			body: {
				email: "alice@inbox-scope.cz",
				name: "Alice",
				password: "12345678",
			},
		});
		const { user: bob } = await api.signUpEmail({
			body: {
				email: "bob@inbox-scope.cz",
				name: "Bob",
				password: "12345678",
			},
		});

		await seedInbox(database, [
			{
				id: "scope-alice",
				userId: alice.id,
				reference: [
					"listing-shared",
				],
				family: "reaction",
				type: "favourite",
				payload: {
					listingId: "listing-shared",
				},
				priority: "common",
			},
			{
				id: "scope-bob",
				userId: bob.id,
				reference: [
					"listing-shared",
				],
				family: "reaction",
				type: "favourite",
				payload: {
					listingId: "listing-shared",
				},
				priority: "common",
			},
		]);

		// Alice archives by reference — scope is alice's userId
		await Effect.gen(function* () {
			yield* inboxArchiveFx({
				scope: {
					userId: alice.id,
				},
				where: {
					reference: "listing-shared",
				},
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		const aliceItem = await database.kysely
			.selectFrom("inbox")
			.select("archivedAt")
			.where("id", "=", "scope-alice")
			.executeTakeFirstOrThrow();

		const bobItem = await database.kysely
			.selectFrom("inbox")
			.select("archivedAt")
			.where("id", "=", "scope-bob")
			.executeTakeFirstOrThrow();

		expect(aliceItem.archivedAt).not.toBeNull();
		// Bob's item must remain untouched — scope filtered by userId
		expect(bobItem.archivedAt).toBeNull();
	});
});
