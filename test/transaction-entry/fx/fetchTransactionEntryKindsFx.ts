import { Effect } from "effect";
import type { testabase } from "~/test/testabase";

type TestDatabase = Awaited<ReturnType<typeof testabase>>;

export namespace fetchTransactionEntryKindsFx {
	export interface Props {
		database: TestDatabase;
		transactionId: string;
	}
}

export const fetchTransactionEntryKindsFx = ({
	database,
	transactionId,
}: fetchTransactionEntryKindsFx.Props) =>
	Effect.promise(async () => {
		const entries = await database.kysely
			.selectFrom("transaction_entry")
			.select("kind")
			.where("transactionId", "=", transactionId)
			.orderBy("createdAt", "asc")
			.execute();

		return entries.map((entry) => entry.kind);
	});
