import { Effect } from "effect";
import type { Database } from "~/server/database/Database";
import type { testabase } from "~/test/testabase";

type TestDatabase = Awaited<ReturnType<typeof testabase>>;

export namespace fetchActivityItemsFx {
	export interface Props {
		database: TestDatabase;
		userId: string;
		type?: Database["activity"]["type"];
	}
}

export const fetchActivityItemsFx = ({ database, userId, type }: fetchActivityItemsFx.Props) =>
	Effect.promise(() => {
		const query = database.kysely
			.selectFrom("activity")
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
