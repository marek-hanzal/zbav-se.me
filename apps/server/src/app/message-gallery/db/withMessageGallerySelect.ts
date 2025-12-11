import { sql } from "kysely";
import { match } from "ts-pattern";
import type { MessageGallerySortSchema } from "~/app/message-gallery/schema/MessageGallerySortSchema";
import type { WithDatabase } from "~/database/WithDatabase";

export namespace withMessageGallerySelect {
	export interface Props {
		database: WithDatabase;
		sort: MessageGallerySortSchema.Type[] | undefined;
	}

	export type Select = ReturnType<typeof withMessageGallerySelect>;
}

export const withMessageGallerySelect = ({ database, sort }: withMessageGallerySelect.Props) => {
	let query = database
		.selectFrom("message_gallery as mg")
		.selectAll()
		.select(sql<"gallery">`'gallery'`.as("type"));

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("mg.createdAt", item.direction))
			.exhaustive();
	}

	return query;
};
