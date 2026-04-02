import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import type { InboxPriorityEnumSchema } from "~/common/inbox/enum/InboxPriorityEnumSchema";
import type { InboxTypeEnumSchema } from "~/common/inbox/enum/InboxTypeEnumSchema";
import { auth } from "~/server/auth/auth";
import type { InboxTableSchema } from "~/server/database/@table/InboxTableSchema";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { inboxArchiveFx } from "~/user/inbox/server/fx/inboxArchiveFx";
import { inboxCollectionFx } from "~/user/inbox/server/fx/inboxCollectionFx";

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
	it("archived items disappear from collection when filtered with archivedAtIsNull", async () => {
		const database = await testabase("inboxArchive-collection-filter");
		const { api } = auth(() => database.dialect);

		return Effect.gen(function* () {
			const { user } = yield* Effect.promise(() =>
				api.signUpEmail({
					body: {
						email: "user@inbox-archive-coll.cz",
						name: "User",
						password: "12345678",
					},
				}),
			);

			yield* Effect.promise(() =>
				seedInbox(database, [
					{
						id: "coll-active",
						userId: user.id,
						reference: [
							"listing-active",
						],
						family: "reaction",
						type: "favourite",
						payload: {
							listingId: "listing-active",
						},
						priority: "common",
					},
					{
						id: "coll-to-archive",
						userId: user.id,
						reference: [
							"listing-old",
						],
						family: "reaction",
						type: "favourite",
						payload: {
							listingId: "listing-old",
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
					reference: "listing-old",
				},
			});

			const active = yield* inboxCollectionFx({
				scope: {
					userId: user.id,
				},
				where: {
					archivedAtIsNull: true,
				},
			});

			const ids = active.map((i) => i.id);
			expect(ids).toContain("coll-active");
			expect(ids).not.toContain("coll-to-archive");

			const all = yield* inboxCollectionFx({
				scope: {
					userId: user.id,
				},
			});

			const allIds = all.map((i) => i.id);
			expect(allIds).toContain("coll-active");
			expect(allIds).toContain("coll-to-archive");
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
