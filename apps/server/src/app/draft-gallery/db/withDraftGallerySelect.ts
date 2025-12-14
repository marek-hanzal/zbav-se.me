import { match } from "ts-pattern";
import type { DraftGallerySortSchema } from "~/app/draft-gallery/schema/DraftGallerySortSchema";
import type { WithDatabase } from "~/database/WithDatabase";

export namespace withDraftGallerySelect {
	export interface Props {
		database: WithDatabase;
		sort: DraftGallerySortSchema.Type[] | undefined;
	}

	export type Select = ReturnType<typeof withDraftGallerySelect>;
}

export const withDraftGallerySelect = ({ database, sort }: withDraftGallerySelect.Props) => {
	let query = database.selectFrom("draft_gallery as dg").selectAll();

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("dg.createdAt", item.direction))
			.exhaustive();
	}

	return query;
};
