import type { withDraftCollectionSelect } from "~/app/draft/db/withDraftCollectionSelect";
import type { DraftFilterSchema } from "~/app/draft/schema/DraftFilterSchema";

export namespace withDraftQueryBuilder {
	export interface Props<
		TSelect extends withDraftCollectionSelect.Select = withDraftCollectionSelect.Select,
	> {
		select: TSelect;
		where?: DraftFilterSchema.Type;
	}

	export type Callback = <TSelect extends withDraftCollectionSelect.Select>(
		props: Props<TSelect>,
	) => TSelect;
}

/**
 * Standalone query builder that applies all filters from DraftQuerySchema
 * Can be used by both list and count queries to ensure consistency
 * Generic to support extended select types that extend from withDraftCollectionSelect.Select
 */
export const withDraftQueryBuilder: withDraftQueryBuilder.Callback = <
	TSelect extends withDraftCollectionSelect.Select,
>({
	select,
	where,
}: withDraftQueryBuilder.Props<TSelect>): TSelect => {
	let query = select;

	if (where?.id) {
		query = query.where("d.id", "=", where.id) as TSelect;
	}

	if (where?.idIn && where.idIn.length > 0) {
		query = query.where("d.id", "in", where.idIn) as TSelect;
	}

	if (where?.userId) {
		query = query.where("d.userId", "=", where.userId) as TSelect;
	}

	return query;
};
