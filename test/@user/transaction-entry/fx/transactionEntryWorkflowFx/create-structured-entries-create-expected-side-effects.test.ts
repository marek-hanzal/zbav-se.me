import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { keyOf } from "@/lib/common/key-of";
import { auth } from "~/server/auth/auth";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { fetchInboxItemsFx } from "~/test/inbox/fx/fetchInboxItemsFx";
import { testabase } from "~/test/testabase";
import { createOpenScenarioFx } from "~/test/transaction/fx/createOpenScenarioFx";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { transactionEntryCreateFx } from "~/user/transaction-entry/server/fx/transactionEntryCreateFx";

describe("transactionEntry workflow", () => {
	it("creates location, personal and package entries with touch, inbox and user-event side effects", async () => {
		const database = await testabase("transactionEntry-structured-workflow");
		const { api } = auth(() => database.dialect);

		return Effect.gen(function* () {
			const users = yield* createUsersFx({
				api,
				slug: "transaction-entry-structured",
			});
			const { seller, buyer } = users;

			const { transactionId, listingId } = yield* createOpenScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
				database,
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
			const packageEntry = yield* transactionEntryCreateFx({
				userId: seller.id,
				transactionId,
				kind: "package",
				payload: {
					link: "https://example.com/package/123",
					number: "PKG-123",
				},
			});

			expect(locationEntry.kind).toBe("location");
			expect(locationEntry.direction).toBe("out");
			expect(personalEntry.kind).toBe("personal");
			expect(personalEntry.direction).toBe("out");
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
			const buyerToSellerInbox = yield* fetchInboxItemsFx({
				database,
				userId: seller.id,
				type: "buyer-message",
			});
			const sellerToBuyerInbox = yield* fetchInboxItemsFx({
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
				buyerToSellerInbox.some(
					(item) =>
						"transactionEntryId" in item.payload &&
						item.payload.transactionEntryId === locationEntry.id,
				),
			).toBe(true);
			expect(
				buyerToSellerInbox.some(
					(item) =>
						"transactionEntryId" in item.payload &&
						item.payload.transactionEntryId === personalEntry.id,
				),
			).toBe(true);
			expect(
				sellerToBuyerInbox.some(
					(item) =>
						"transactionEntryId" in item.payload &&
						item.payload.transactionEntryId === packageEntry.id,
				),
			).toBe(true);

			expect(interactionEvents).toHaveLength(6);
			expect(
				interactionEvents.every(
					(event) =>
						event.group === keyOf(transactionId) &&
						event.event === "transaction.message",
				),
			).toBe(true);
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
