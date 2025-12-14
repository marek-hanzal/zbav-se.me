import type { withDraftGallerySelect } from "~/app/draft-gallery/db/withDraftGallerySelect";
import type { DraftGalleryFilterSchema } from "~/app/draft-gallery/schema/DraftGalleryFilterSchema";

export namespace withDraftGalleryQueryBuilder {
	export interface Props<
		TSelect extends withDraftGallerySelect.Select = withDraftGallerySelect.Select,
	> {
		select: TSelect;
		where?: DraftGalleryFilterSchema.Type;
	}

	export type Callback = <TSelect extends withDraftGallerySelect.Select>(
		props: Props<TSelect>,
	) => TSelect;
}

/**
 * Standalone query builder that applies all filters from DraftGalleryQuerySchema
 * Can be used by both list and count queries to ensure consistency
 * Generic to support extended select types that extend from withDraftGallerySelect.Select
 */
export const withDraftGalleryQueryBuilder: withDraftGalleryQueryBuilder.Callback = <
	TSelect extends withDraftGallerySelect.Select,
>({
	select,
	where,
}: withDraftGalleryQueryBuilder.Props<TSelect>): TSelect => {
	let query = select;

	if (where?.id) {
		query = query.where("dg.id", "=", where.id) as TSelect;
	}

	if (where?.idIn && where.idIn.length > 0) {
		query = query.where("dg.id", "in", where.idIn) as TSelect;
	}

	if (where?.draftId) {
		query = query.where("dg.draftId", "=", where.draftId) as TSelect;
	}

	if (where?.galleryId) {
		query = query.where("dg.galleryId", "=", where.galleryId) as TSelect;
	}

	return query;
};
