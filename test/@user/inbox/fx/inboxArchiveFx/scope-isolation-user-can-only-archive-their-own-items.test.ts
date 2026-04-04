import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import type { InboxPriorityEnumSchema } from "~/common/inbox/enum/InboxPriorityEnumSchema";
import type { InboxTypeEnumSchema } from "~/common/inbox/enum/InboxTypeEnumSchema";
import type { InboxTableSchema } from "~/server/database/@table/InboxTableSchema";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
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
	it("scope isolation: user can only archive their own items", async () => {
		const database = await testabase("inboxArchive-scope-isolation");

		return Effect.gen(function* () {
			const alice = yield* leaseTestUserFx({});
			const bob = yield* leaseTestUserFx({});

			yield* Effect.promise(() =>
				seedInbox(database, [
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
				]),
			);

			yield* inboxArchiveFx({
				scope: {
					userId: alice.id,
				},
				where: {
					reference: "listing-shared",
				},
			});

			const aliceItem = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("inbox")
					.select("archivedAt")
					.where("id", "=", "scope-alice")
					.executeTakeFirstOrThrow(),
			);

			const bobItem = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("inbox")
					.select("archivedAt")
					.where("id", "=", "scope-bob")
					.executeTakeFirstOrThrow(),
			);

			expect(aliceItem.archivedAt).not.toBeNull();
			expect(bobItem.archivedAt).toBeNull();
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
