import { database } from "../database/kysely";

export namespace withCategoryMissSelect {
	export type Select = ReturnType<typeof withCategoryMissSelect>;
}

export const withCategoryMissSelect = () => {
	return database.kysely.selectFrom("category_miss as cm").selectAll("cm");
};
