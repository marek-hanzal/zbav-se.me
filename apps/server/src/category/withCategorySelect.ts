import { database } from "../database/kysely";

export namespace withCategorySelect {
	export type Select = ReturnType<typeof withCategorySelect>;
}

export const withCategorySelect = () => {
	return database.kysely.selectFrom("category as c").selectAll("c");
};
