import { database } from "../database/kysely";

export namespace withLocationSelect {
	export type Select = ReturnType<typeof withLocationSelect>;
}

export const withLocationSelect = () => {
	return database.kysely.selectFrom("location as l").selectAll("l");
};
