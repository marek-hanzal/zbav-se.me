import path from "node:path";
import { Effect } from "effect";
import { transactionCreateFx } from "~/buyer-transaction/fx/transactionCreateFx";
import { TransactionEntryTableSchema } from "~/database/schema/TransactionEntryTable";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { TransactionEntrySensitiveKindEnumSchema } from "~/transaction-contract/schema/TransactionEntrySensitiveKindEnumSchema";
import { expect, testFn } from "../testFn";
import { uploadFixtureViaS3Fn } from "../utils/uploadFixtureViaS3Fn";

const fixturePath = path.resolve(import.meta.dirname, "../fixtures/listing-create-image.jpg");

testFn.setTimeout(120_000);

for (const role of [
	"buyer",
	"seller",
] as const) {
	testFn(
		`${role} sees cron-expired transaction as a system message`,
		async ({ page, database, signInFn, withRequestFn }) => {
			const { sellerUser, buyerUser } = await testFn.step(
				"Lease seller and buyer",
				async () =>
					Effect.gen(function* () {
						const sellerUser = yield* leaseTestUserFx({
							key: "a",
						});
						const buyerUser = yield* leaseTestUserFx({
							key: "b",
						});

						return {
							sellerUser,
							buyerUser,
						};
					}).pipe(withRuntimeFn(database), Effect.runPromise),
			);
			const { transaction, locationId } = await testFn.step(
				"Upload fixture and prepare a transaction",
				async () => {
					const upload = await uploadFixtureViaS3Fn({
						database,
						userId: sellerUser.id,
						path: fixturePath,
					});
					const listing = await createListingFx(sellerUser.id, {
						title: `E2E ${role} expired transaction ${Date.now()}`,
						uploadId: upload.id,
					}).pipe(withRuntimeFn(database), Effect.runPromise);

					const transaction = await transactionCreateFx({
						listingId: listing.id,
						userId: buyerUser.id,
					}).pipe(withRuntimeFn(database), Effect.runPromise);

					return {
						transaction,
						locationId: listing.locationId,
					};
				},
			);

			await testFn.step(
				"Expire the transaction and add sensitive and ordinary entries",
				async () => {
					await database.kysely
						.updateTable("transaction")
						.set({
							expiresAt: new Date(Date.now() - 60_000),
						})
						.where("id", "=", transaction.id)
						.execute();

					const createdAt = new Date();
					const payloadByKind = {
						location: {
							locationId,
						},
						package: {
							link: "https://example.com/e2e-tracking",
							number: `e2e-${transaction.id}`,
						},
						personal: {
							name: "E2E Buyer",
							phone: "+420123456789",
							email: buyerUser.email,
						},
					};

					await database.kysely
						.insertInto("transaction_entry")
						.values([
							...TransactionEntrySensitiveKindEnumSchema.options.map((kind) =>
								TransactionEntryTableSchema.parse({
									id: `${transaction.id}-${kind}`,
									transactionId: transaction.id,
									kind,
									userId: kind === "package" ? sellerUser.id : buyerUser.id,
									payload: payloadByKind[kind],
									createdAt,
								}),
							),
							{
								id: `${transaction.id}-text`,
								transactionId: transaction.id,
								kind: "text" as const,
								userId: buyerUser.id,
								payload: {
									text: "keep me",
								},
								createdAt,
							},
						])
						.execute();
				},
			);

			await testFn.step("Run the real expiration cron endpoint", async () => {
				const token = process.env.SERVER_CRON_TOKEN;

				if (!token) throw new Error("SERVER_CRON_TOKEN is required for cron e2e tests");

				await withRequestFn(async (request) => {
					const response = await request.post("/api/cron/04", {
						headers: {
							authorization: `Bearer ${token}`,
						},
						timeout: 10_000,
					});

					await expect(response).toBeOK();
					expect(await response.json()).toEqual({
						type: "info",
						message: "Done [04]",
					});
				});
			});

			await testFn.step(
				"Verify expiration and removal of every sensitive entry kind",
				async () => {
					const expiredTransaction = await database.kysely
						.selectFrom("transaction")
						.select("status")
						.where("id", "=", transaction.id)
						.executeTakeFirstOrThrow();
					const entries = await database.kysely
						.selectFrom("transaction_entry")
						.select([
							"id",
							"kind",
							"payload",
						])
						.where("transactionId", "=", transaction.id)
						.execute();
					const remainingKinds = entries.map(({ kind }) => kind);

					expect(expiredTransaction.status).toBe("expired");

					for (const kind of TransactionEntrySensitiveKindEnumSchema.options) {
						expect(remainingKinds).not.toContain(kind);
					}

					expect(entries).toEqual(
						expect.arrayContaining([
							expect.objectContaining({
								id: `${transaction.id}-text`,
								kind: "text",
								payload: {
									text: "keep me",
								},
							}),
							expect.objectContaining({
								kind: "status-expired",
							}),
						]),
					);
				},
			);

			await testFn.step(`Sign in as ${role} and read the system message`, async () => {
				await signInFn(role === "buyer" ? buyerUser : sellerUser);
				await page.goto(`/cs/app/${role}/transaction/${transaction.id}/detail`);
				await expect(
					page.getByText("Automaticky ukončený obchod, dlouho se nic nedělo."),
				).toBeVisible();
			});
		},
	);
}
