import { Effect } from "effect";
import { transactionResolveFx } from "~/client/@seller/transaction/server/fx/transactionResolveFx";
import type { testabase } from "~/test/testabase";
import { createOpenScenarioFx } from "~/test/utils/createOpenScenarioFx";

type TestDatabase = Awaited<ReturnType<typeof testabase>>;

type CreateResolvedScenarioInput = {
	sellerId: string;
	buyerId: string;
	database: TestDatabase;
};

export const createResolvedScenarioFx = ({
	sellerId,
	buyerId,
	database,
}: CreateResolvedScenarioInput) =>
	Effect.gen(function* () {
		const { listingId, transactionId } = yield* createOpenScenarioFx({
			sellerId,
			buyerId,
			database,
		});

		yield* transactionResolveFx({
			transactionId,
			userId: sellerId,
		});

		return {
			listingId,
			transactionId,
		};
	});
