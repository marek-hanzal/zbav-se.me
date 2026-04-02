import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { keyOf } from "@/lib/common/key-of";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { fetchInboxItemsFx } from "~/test/inbox/fx/fetchInboxItemsFx";
import { testabase } from "~/test/testabase";
import { createOpenScenarioFx } from "~/test/transaction/fx/createOpenScenarioFx";
import { createDbUserFx } from "~/test/user/fx/createDbUserFx";
import { transactionEntryCreateFx } from "~/user/transaction-entry/server/fx/transactionEntryCreateFx";

describe("transactionEntry workflow", () => {
	it("creates buyer structured entries with seller inbox and interaction side effects", async () => {
		const database = await testabase("transactionEntry-structured-workflow-buyer");

		return Effect.gen(function* () {
			const seller = yield* createDbUserFx({
				email: "transaction-entry-structured-seller@test.cz",
				name: "Transaction Entry Structured Seller",
			});
			const buyer = yield* createDbUserFx({
				email: "transaction-entry-structured-buyer@test.cz",
				name: "Transaction Entry Structured Buyer",
			});

			const { transactionId, listingId } = yield* createOpenScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});

			const listing = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("listing")
					.select("locationId")
					.where("id", "=", listingId)
					.executeTakeFirstOrThrow(),
			);
			const beforeTransaction = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction")
					.select([
						"updatedAt",
						"expiresAt",
					])
					.where("id", "=", transactionId)
					.executeTakeFirstOrThrow(),
			);

			const locationEntry = yield* transactionEntryCreateFx({
				userId: buyer.id,
				transactionId,
				kind: "location",
				payload: {
					locationId: listing.locationId,
				},
			});
			const personalEntry = yield* transactionEntryCreateFx({
				userId: buyer.id,
				transactionId,
				kind: "personal",
				payload: {
					name: "Buyer Contact",
					phone: "+420777888999",
					email: "buyer-contact@test.cz",
					locationId: listing.locationId,
				},
			});

			expect(locationEntry.kind).toBe("location");
			expect(personalEntry.kind).toBe("personal");

			const afterTransaction = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction")
					.select([
						"updatedAt",
						"expiresAt",
					])
					.where("id", "=", transactionId)
					.executeTakeFirstOrThrow(),
			);
			const sellerInbox = yield* fetchInboxItemsFx({
				database,
				userId: seller.id,
				type: "buyer-message",
			});
			const interactionEvents = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("user_event")
					.select([
						"userId",
						"scope",
						"event",
						"group",
					])
					.where("group", "=", keyOf(transactionId))
					.where("event", "=", "transaction.message")
					.execute(),
			);

			expect(afterTransaction.updatedAt.getTime()).toBeGreaterThan(
				beforeTransaction.updatedAt.getTime(),
			);
			expect(afterTransaction.expiresAt.getTime()).toBeGreaterThan(
				beforeTransaction.expiresAt.getTime(),
			);
			expect(
				sellerInbox.some(
					(item) =>
						"transactionEntryId" in item.payload &&
						item.payload.transactionEntryId === locationEntry.id,
				),
			).toBe(true);
			expect(
				sellerInbox.some(
					(item) =>
						"transactionEntryId" in item.payload &&
						item.payload.transactionEntryId === personalEntry.id,
				),
			).toBe(true);
			expect(interactionEvents).toHaveLength(4);
			expect(
				interactionEvents.filter(
					(event) => event.userId === buyer.id && event.scope === "user",
				),
			).toHaveLength(2);
			expect(
				interactionEvents.filter(
					(event) => event.userId === seller.id && event.scope === "foreign",
				),
			).toHaveLength(2);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});

	it("creates seller package entries with buyer inbox and interaction side effects", async () => {
		const database = await testabase("transactionEntry-structured-workflow-seller");

		return Effect.gen(function* () {
			const seller = yield* createDbUserFx({
				email: "transaction-entry-package-seller@test.cz",
				name: "Transaction Entry Package Seller",
			});
			const buyer = yield* createDbUserFx({
				email: "transaction-entry-package-buyer@test.cz",
				name: "Transaction Entry Package Buyer",
			});

			const { transactionId } = yield* createOpenScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});

			const beforeTransaction = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction")
					.select([
						"updatedAt",
						"expiresAt",
					])
					.where("id", "=", transactionId)
					.executeTakeFirstOrThrow(),
			);

			const packageEntry = yield* transactionEntryCreateFx({
				userId: seller.id,
				transactionId,
				kind: "package",
				payload: {
					link: "https://example.com/package/123",
					number: "PKG-123",
				},
			});

			expect(packageEntry.kind).toBe("package");
			expect(packageEntry.direction).toBe("out");

			const afterTransaction = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction")
					.select([
						"updatedAt",
						"expiresAt",
					])
					.where("id", "=", transactionId)
					.executeTakeFirstOrThrow(),
			);
			const buyerInbox = yield* fetchInboxItemsFx({
				database,
				userId: buyer.id,
				type: "seller-message",
			});
			const interactionEvents = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("user_event")
					.select([
						"userId",
						"scope",
						"event",
						"group",
					])
					.where("group", "=", keyOf(transactionId))
					.where("event", "=", "transaction.message")
					.execute(),
			);

			expect(afterTransaction.updatedAt.getTime()).toBeGreaterThan(
				beforeTransaction.updatedAt.getTime(),
			);
			expect(afterTransaction.expiresAt.getTime()).toBeGreaterThan(
				beforeTransaction.expiresAt.getTime(),
			);
			expect(
				buyerInbox.some(
					(item) =>
						"transactionEntryId" in item.payload &&
						item.payload.transactionEntryId === packageEntry.id,
				),
			).toBe(true);
			expect(interactionEvents).toHaveLength(2);
			expect(
				interactionEvents.filter(
					(event) => event.userId === seller.id && event.scope === "user",
				),
			).toHaveLength(1);
			expect(
				interactionEvents.filter(
					(event) => event.userId === buyer.id && event.scope === "foreign",
				),
			).toHaveLength(1);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
