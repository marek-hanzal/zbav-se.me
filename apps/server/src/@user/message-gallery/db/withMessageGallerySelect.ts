import { match } from "ts-pattern";
import type { WithDatabase } from "~/database/WithDatabase";
import type { MessageGallerySortSchema } from "../schema/MessageGallerySortSchema";

export namespace withMessageGallerySelect {
	export interface Props {
		database: WithDatabase;
		sort: MessageGallerySortSchema.Type[] | undefined;
	}

	export type Select = ReturnType<typeof withMessageGallerySelect>;
}

export const withMessageGallerySelect = ({ database, sort }: withMessageGallerySelect.Props) => {
	let query = database.selectFrom("message_gallery as mg").selectAll();

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("mg.createdAt", item.direction))
			.exhaustive();
	}

	return query;
};
