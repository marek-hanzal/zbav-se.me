import { match } from "ts-pattern";
import { database } from "../database/kysely";
import type { UploadSortSchema } from "./schema/UploadSortSchema";

export namespace withUploadSelect {
	export interface Props {
		sort?: UploadSortSchema.Type[];
	}
	export type Select = ReturnType<typeof withUploadSelect>;
}

export const withUploadSelect = ({ sort }: withUploadSelect.Props = {}) => {
	let query = database.kysely.selectFrom("upload as u").select([
		"u.id",
		"u.url",
	]);

	for (const sortItem of sort ?? []) {
		if (!sortItem.sort) {
			continue;
		}
		const { sort: key, value } = sortItem;

		query = match(value)
			.with("createdAt", () => query.orderBy("u.createdAt", key))
			.exhaustive();
	}

	return query;
};
