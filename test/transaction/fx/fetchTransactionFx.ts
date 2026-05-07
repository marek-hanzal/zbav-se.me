import { Effect } from "effect";
import type { SelectExpression } from "kysely";
import type { Database } from "~/server/database/Database";
import type { testabase } from "~/test/testabase";

type TestDatabase = Awaited<ReturnType<typeof testabase>>;

export namespace fetchTransactionFx {
	export interface Props<Selection extends SelectExpression<Database, "transaction">> {
		database: TestDatabase;
		id: string;
		select: readonly Selection[];
	}
}

export const fetchTransactionFx = <Selection extends SelectExpression<Database, "transaction">>({
	database,
	id,
	select,
}: fetchTransactionFx.Props<Selection>) =>
	Effect.promise(() =>
		database.kysely
			.selectFrom("transaction")
			.select(select)
			.where("id", "=", id)
			.executeTakeFirstOrThrow(),
	);
