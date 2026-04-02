import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { auth } from "~/server/auth/auth";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createUserFx } from "~/test/user/fx/createUserFx";
import { inboxCreateFx } from "~/user/inbox/server/fx/inboxCreateFx";

describe("inboxCreateFx", () => {
	it("persists default reference, keeps archivedAt null and stays scoped to owner", async () => {
		const database = await testabase("inboxCreateFx-contract");
		const { api } = auth(() => database.dialect);

		return Effect.gen(function* () {
			const owner = yield* createUserFx({
				api,
				email: "inbox-create-owner@test.cz",
				name: "Inbox Create Owner",
			});
			const stranger = yield* createUserFx({
				api,
				email: "inbox-create-stranger@test.cz",
				name: "Inbox Create Stranger",
			});

			const inbox = yield* inboxCreateFx({
				userId: owner.id,
				family: "transaction",
				type: "system",
				payload: {
					transactionId: "transaction-direct",
					listingId: "listing-direct",
					target: "buyer",
				},
				priority: "high",
			});

			expect(inbox.reference).toEqual([]);
			expect(inbox.family).toBe("transaction");
			expect(inbox.type).toBe("system");
			expect(inbox.priority).toBe("high");
			expect(inbox.payload).toMatchObject({
				transactionId: "transaction-direct",
				listingId: "listing-direct",
				target: "buyer",
			});

			const persisted = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("inbox")
					.select([
						"userId",
						"reference",
						"archivedAt",
						"family",
						"type",
						"priority",
					])
					.where("id", "=", inbox.id)
					.executeTakeFirstOrThrow(),
			);

			expect(persisted.userId).toBe(owner.id);
			expect(persisted.reference).toEqual([]);
			expect(persisted.archivedAt).toBeNull();
			expect(persisted.family).toBe("transaction");
			expect(persisted.type).toBe("system");
			expect(persisted.priority).toBe("high");

			const foreignRead = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("inbox")
					.select("id")
					.where("id", "=", inbox.id)
					.where("userId", "=", stranger.id)
					.executeTakeFirst(),
			);

			expect(foreignRead).toBeUndefined();
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
