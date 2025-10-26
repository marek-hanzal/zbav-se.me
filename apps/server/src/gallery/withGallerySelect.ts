import { database } from "../database/kysely";

export namespace withGallerySelect {
	export type Select = ReturnType<typeof withGallerySelect>;
}

export const withGallerySelect = () => {
	return database.kysely.selectFrom("gallery as g").selectAll("g");
};
