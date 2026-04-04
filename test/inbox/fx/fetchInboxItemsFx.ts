import { Effect } from "effect";
import type { Database } from "~/server/database/Database";
import type { testabase } from "~/test/testabase";

type TestDatabase = Awaited<ReturnType<typeof testabase>>;

export namespace fetchInboxItemsFx {
	export interface Props {
		database: TestDatabase;
		userId: string;
		type?: Database["inbox"]["type"];
	}
}

export const fetchInboxItemsFx = ({ database, userId, type }: fetchInboxItemsFx.Props) =>
	Effect.promise(() => {
		const query = database.kysely
			.selectFrom("inbox")
			.select([
				"id",
				"type",
				"reference",
				"payload",
				"userId",
			])
			.where("userId", "=", userId);

		return (type ? query.where("type", "=", type) : query).execute();
	});
