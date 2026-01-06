import { Effect } from "effect";
import { sql } from "kysely";
import type { withUserEventCollectionSelectFx } from "~/app/user-event/db/withUserEventCollectionSelectFx";
import type { UserEventFilterSchema } from "~/app/user-event/schema/UserEventFilterSchema";

export namespace withUserEventQueryBuilderFx {
	export interface Props<
		TSelect extends
			withUserEventCollectionSelectFx.Select = withUserEventCollectionSelectFx.Select,
	> {
		select: TSelect;
		where?: UserEventFilterSchema.Type;
	}

	export type Callback = <TSelect extends withUserEventCollectionSelectFx.Select>(
		props: Props<TSelect>,
	) => TSelect;
}

/**
 * Standalone query builder that applies all filters from UserEventQuerySchema.
 * Generic to support extended select types (e.g. collection selects returning full rows).
 */
export const withUserEventQueryBuilderFx = Effect.fn("withUserEventQueryBuilderFx")(function* <
	TSelect extends withUserEventCollectionSelectFx.Select,
>({ select, where }: withUserEventQueryBuilderFx.Props<TSelect>) {
	let query = select;

	if (!where) {
		return yield* Effect.succeed(select);
	}

	if (where.id) {
		query = query.where("ue.id", "=", where.id) as TSelect;
	}

	if (where.idIn && where.idIn.length > 0) {
		query = query.where("ue.id", "in", where.idIn) as TSelect;
	}

	if (where.userId) {
		query = query.where("ue.userId", "=", where.userId) as TSelect;
	}

	if (where.scope) {
		query = query.where("ue.scope", "=", where.scope) as TSelect;
	}

	if (where.source) {
		query = query.where("ue.source", "=", where.source) as TSelect;
	}

	if (where.group) {
		query = query.where("ue.group", "=", where.group) as TSelect;
	}

	if (where.event) {
		query = query.where("ue.event", "=", where.event) as TSelect;
	}

	if (where.isTerminal !== undefined) {
		query = query.where("ue.isTerminal", "=", where.isTerminal) as TSelect;
	}

	if (where.cutoff !== undefined) {
		query = query.where(
			"ue.createdAt",
			">=",
			sql<Date>`now() - make_interval(days => ${where.cutoff})`,
		) as TSelect;
	}

	return yield* Effect.succeed(query);
});
