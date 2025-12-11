import { match } from "ts-pattern";
import type { WithDatabase } from "~/database/WithDatabase";
import type { UploadSortSchema } from "../schema/UploadSortSchema";

export namespace withUploadSelect {
	export interface Props {
		database: WithDatabase;
		sort?: UploadSortSchema.Type[];
	}
	export type Select = ReturnType<typeof withUploadSelect>;
}

export const withUploadSelect = ({ database, sort }: withUploadSelect.Props) => {
	let query = database.selectFrom("upload as u").select([
		"u.id",
		"u.url",
	]);

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("u.createdAt", item.direction))
			.exhaustive();
	}

	return query;
};
