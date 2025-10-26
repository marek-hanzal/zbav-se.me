import { database } from "../database/kysely";

export namespace withUploadSelect {
	export type Select = ReturnType<typeof withUploadSelect>;
}

export const withUploadSelect = () => {
	return database.kysely.selectFrom("upload as u").select([
		"u.id",
		"u.url",
		"u.createdAt",
	]);
};
