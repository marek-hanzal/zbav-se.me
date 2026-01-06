import { Effect } from "effect";
import type { withDraftCollectionSelectFx } from "~/app/draft/db/withDraftCollectionSelectFx";
import type { DraftFilterSchema } from "~/app/draft/schema/DraftFilterSchema";

export namespace withDraftQueryBuilderFx {
	export interface Props<
		TSelect extends withDraftCollectionSelectFx.Select = withDraftCollectionSelectFx.Select,
	> {
		select: TSelect;
		where?: DraftFilterSchema.Type;
	}

	export type Callback = <TSelect extends withDraftCollectionSelectFx.Select>(
		props: Props<TSelect>,
	) => TSelect;
}

/**
 * Standalone query builder that applies all filters from DraftQuerySchema
 * Can be used by both list and count queries to ensure consistency
 * Generic to support extended select types that extend from withDraftCollectionSelectFx.Select
 */
export const withDraftQueryBuilderFx = Effect.fn("withDraftQueryBuilderFx")(function* <
	TSelect extends withDraftCollectionSelectFx.Select,
>({ select, where }: withDraftQueryBuilderFx.Props<TSelect>) {
	let query = select;

	if (!where) {
		return yield* Effect.succeed(select);
	}

	if (where?.id) {
		query = query.where("d.id", "=", where.id) as TSelect;
	}

	if (where?.idIn && where.idIn.length > 0) {
		query = query.where("d.id", "in", where.idIn) as TSelect;
	}

	if (where?.userId) {
		query = query.where("d.userId", "=", where.userId) as TSelect;
	}

	if (where?.updatedAtGte !== undefined) {
		query = query.where("d.updatedAt", ">=", where.updatedAtGte) as TSelect;
	}

	if (where?.updatedAtLte !== undefined) {
		query = query.where("d.updatedAt", "<=", where.updatedAtLte) as TSelect;
	}

	if (where?.usedAtIsNull !== undefined) {
		if (where.usedAtIsNull) {
			query = query.where("d.usedAt", "is", null) as TSelect;
		} else {
			query = query.where("d.usedAt", "is not", null) as TSelect;
		}
	}

	return yield* Effect.succeed(query);
});
