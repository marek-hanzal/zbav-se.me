import { database } from "../database/kysely";

export namespace withCategoryGroupSelect {
	export type Select = ReturnType<typeof withCategoryGroupSelect>;
}

export const withCategoryGroupSelect = () => {
	return database.kysely.selectFrom("category_group as cg").selectAll("cg");
};
