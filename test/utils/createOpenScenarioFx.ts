import { Effect } from "effect";
import { transactionAcceptFx } from "~/seller/transaction/server/fx/transactionAcceptFx";
import type { testabase } from "~/test/testabase";
import { createPendingScenarioFx } from "~/test/utils/createPendingScenarioFx";

type TestDatabase = Awaited<ReturnType<typeof testabase>>;

type CreateOpenScenarioInput = {
	sellerId: string;
	buyerId: string;
	database: TestDatabase;
};

export const createOpenScenarioFx = ({ sellerId, buyerId, database }: CreateOpenScenarioInput) =>
	Effect.gen(function* () {
		const { listingId } = yield* createPendingScenarioFx({
			sellerId,
			buyerId,
		});

		const transaction = yield* Effect.promise(() => {
			return database.kysely
				.selectFrom("transaction")
				.select("id")
				.where("listingId", "=", listingId)
				.where("userId", "=", buyerId)
				.executeTakeFirstOrThrow();
		});

		yield* transactionAcceptFx({
			transactionId: transaction.id,
			userId: sellerId,
		});

		return {
			listingId,
			transactionId: transaction.id,
		};
	});
