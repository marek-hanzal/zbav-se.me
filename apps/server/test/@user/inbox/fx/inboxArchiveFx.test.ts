import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { inboxArchiveFx } from "~/@user/inbox/fx/inboxArchiveFx";
import { inboxCollectionFx } from "~/@user/inbox/fx/inboxCollectionFx";
import { auth } from "~/auth/auth";
import { testabase } from "~test/testabase";
import { withRuntimeFx } from "~test/fixture/transactionFixture";

/**
 * Inserts inbox rows directly into the DB — bypasses inboxCreateFx so tests
 * are not coupled to the full transaction/listing lifecycle.
 */
const seedInbox = async (
	database: Awaited<ReturnType<typeof import("~test/testabase").testabase>>,
	rows: Array<{
		id: string;
		userId: string;
		reference: string[];
		family: "transaction" | "reaction";
		type: string;
		payload: Record<string, unknown>;
		priority: "high" | "common";
	}>,
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
			body: { email: "user@inbox-archive-ref.cz", name: "User", password: "12345678" },
		});

		await seedInbox(database, [
			{
				id: "arch-ref-a1",
				userId: user.id,
				reference: ["listing-a", "tx-1"],
				family: "transaction",
				type: "buyer-message",
				payload: { transactionId: "tx-1" },
				priority: "high",
			},
			{
				id: "arch-ref-a2",
				userId: user.id,
				reference: ["listing-a", "tx-1"],
				family: "transaction",
				type: "seller-message",
				payload: { transactionId: "tx-1" },
				priority: "high",
			},
			{
				id: "arch-ref-b1",
				userId: user.id,
				reference: ["listing-b"],
				family: "reaction",
				type: "favourite",
				payload: { listingId: "listing-b" },
				priority: "common",
			},
		]);

		// Archive all items that reference "listing-a"
		await Effect.gen(function* () {
			yield* inboxArchiveFx({
				scope: { userId: user.id },
				where: { reference: "listing-a" },
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		// listing-a items should now have archivedAt set
		const archivedItems = await database.kysely
			.selectFrom("inbox")
			.select(["id", "archivedAt"])
			.where("id", "in", ["arch-ref-a1", "arch-ref-a2"])
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

	it("archived items disappear from collection when filtered with archivedAtIsNull", async () => {
		const database = await testabase("inboxArchive-collection-filter");
		const { api } = auth(() => database.dialect);

		const { user } = await api.signUpEmail({
			body: {
				email: "user@inbox-archive-coll.cz",
				name: "User",
				password: "12345678",
			},
		});

		await seedInbox(database, [
			{
				id: "coll-active",
				userId: user.id,
				reference: ["listing-active"],
				family: "reaction",
				type: "favourite",
				payload: { listingId: "listing-active" },
				priority: "common",
			},
			{
				id: "coll-to-archive",
				userId: user.id,
				reference: ["listing-old"],
				family: "reaction",
				type: "favourite",
				payload: { listingId: "listing-old" },
				priority: "common",
			},
		]);

		// Archive the old one
		await Effect.gen(function* () {
			yield* inboxArchiveFx({
				scope: { userId: user.id },
				where: { reference: "listing-old" },
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		// Collection with archivedAtIsNull: true — should only return active item
		const active = await Effect.gen(function* () {
			return yield* inboxCollectionFx({
				scope: { userId: user.id },
				where: { archivedAtIsNull: true },
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		const ids = active.map((i) => i.id);
		expect(ids).toContain("coll-active");
		expect(ids).not.toContain("coll-to-archive");

		// Collection without filter returns both
		const all = await Effect.gen(function* () {
			return yield* inboxCollectionFx({
				scope: { userId: user.id },
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		const allIds = all.map((i) => i.id);
		expect(allIds).toContain("coll-active");
		expect(allIds).toContain("coll-to-archive");
	});

	it("scope isolation: user can only archive their own items", async () => {
		const database = await testabase("inboxArchive-scope-isolation");
		const { api } = auth(() => database.dialect);

		const { user: alice } = await api.signUpEmail({
			body: { email: "alice@inbox-scope.cz", name: "Alice", password: "12345678" },
		});
		const { user: bob } = await api.signUpEmail({
			body: { email: "bob@inbox-scope.cz", name: "Bob", password: "12345678" },
		});

		await seedInbox(database, [
			{
				id: "scope-alice",
				userId: alice.id,
				reference: ["listing-shared"],
				family: "reaction",
				type: "favourite",
				payload: { listingId: "listing-shared" },
				priority: "common",
			},
			{
				id: "scope-bob",
				userId: bob.id,
				reference: ["listing-shared"],
				family: "reaction",
				type: "favourite",
				payload: { listingId: "listing-shared" },
				priority: "common",
			},
		]);

		// Alice archives by reference — scope is alice's userId
		await Effect.gen(function* () {
			yield* inboxArchiveFx({
				scope: { userId: alice.id },
				where: { reference: "listing-shared" },
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

	it("archives by family: only transaction items get archived, reactions survive", async () => {
		const database = await testabase("inboxArchive-by-family");
		const { api } = auth(() => database.dialect);

		const { user } = await api.signUpEmail({
			body: {
				email: "user@inbox-archive-family.cz",
				name: "User",
				password: "12345678",
			},
		});

		await seedInbox(database, [
			{
				id: "family-tx",
				userId: user.id,
				reference: ["listing-x", "tx-x"],
				family: "transaction",
				type: "buyer-message",
				payload: { transactionId: "tx-x" },
				priority: "high",
			},
			{
				id: "family-reaction",
				userId: user.id,
				reference: ["listing-x"],
				family: "reaction",
				type: "favourite",
				payload: { listingId: "listing-x" },
				priority: "common",
			},
		]);

		// Archive only transaction family
		await Effect.gen(function* () {
			yield* inboxArchiveFx({
				scope: { userId: user.id },
				where: { family: "transaction" },
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		const txItem = await database.kysely
			.selectFrom("inbox")
			.select("archivedAt")
			.where("id", "=", "family-tx")
			.executeTakeFirstOrThrow();

		const reactionItem = await database.kysely
			.selectFrom("inbox")
			.select("archivedAt")
			.where("id", "=", "family-reaction")
			.executeTakeFirstOrThrow();

		expect(txItem.archivedAt).not.toBeNull();
		expect(reactionItem.archivedAt).toBeNull();
	});

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
				reference: ["listing-cursor"],
				family: "reaction",
				type: "favourite",
				payload: { listingId: "listing-cursor" },
				priority: "common",
			},
			{
				id: "cursor-2",
				userId: user.id,
				reference: ["listing-cursor"],
				family: "reaction",
				type: "favourite",
				payload: { listingId: "listing-cursor" },
				priority: "common",
			},
			{
				id: "cursor-3",
				userId: user.id,
				reference: ["listing-cursor"],
				family: "reaction",
				type: "favourite",
				payload: { listingId: "listing-cursor" },
				priority: "common",
			},
		]);

		// Archive with cursor size 2 — only 2 should be archived
		await Effect.gen(function* () {
			yield* inboxArchiveFx({
				scope: { userId: user.id },
				where: { reference: "listing-cursor" },
				cursor: { page: 0, size: 2 },
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
