import { Effect } from "effect";
import { DateContextFx } from "@/lib/common/date";
import type { UserRestrictionFilterSchema } from "../schema/UserRestrictionFilterSchema";
import type { withUserRestrictionSourceSelectFx } from "./withUserRestrictionSourceSelectFx";

export namespace withUserRestrictionQueryBuilderFx {
	export interface Props<
		TSelect extends
			withUserRestrictionSourceSelectFx.Select = withUserRestrictionSourceSelectFx.Select,
	> {
		select: TSelect;
		where?: UserRestrictionFilterSchema.Type;
	}

	export type Callback = <TSelect extends withUserRestrictionSourceSelectFx.Select>(
		props: Props<TSelect>,
	) => TSelect;
}

export const withUserRestrictionQueryBuilderFx = Effect.fn("withUserRestrictionQueryBuilderFx")(
	function* <TSelect extends withUserRestrictionSourceSelectFx.Select>({
		select,
		where,
	}: withUserRestrictionQueryBuilderFx.Props<TSelect>) {
		const dateContext = yield* DateContextFx;
		const now = dateContext.now().toJSDate();

		let query = select;

		if (!where) {
			return yield* Effect.succeed(select);
		}

		if (where.id) {
			query = query.where("ur.id", "=", where.id) as TSelect;
		}

		if (where.idIn && where.idIn.length > 0) {
			query = query.where("ur.id", "in", where.idIn) as TSelect;
		}

		if (where.userId) {
			query = query.where("ur.userId", "=", where.userId) as TSelect;
		}

		if (where.restriction) {
			query = query.where("ur.restriction", "=", where.restriction) as TSelect;
		}

		if (where.isAvailable === true) {
			query = query.where("ur.availableAt", "<=", now).where((eb) =>
				eb.or([
					eb("ur.expiresAt", "is", null),
					eb("ur.expiresAt", ">", now),
				]),
			) as TSelect;
		}

		if (where.isAvailable === false) {
			query = query.where((eb) =>
				eb.or([
					eb("ur.availableAt", ">", now),
					eb.and([
						eb("ur.expiresAt", "is not", null),
						eb("ur.expiresAt", "<=", now),
					]),
				]),
			) as TSelect;
		}

		if (where.availableAtGte) {
			query = query.where("ur.availableAt", ">=", where.availableAtGte) as TSelect;
		}

		if (where.availableAtLte) {
			query = query.where("ur.availableAt", "<=", where.availableAtLte) as TSelect;
		}

		if (where.expiresAtGte) {
			query = query.where("ur.expiresAt", ">=", where.expiresAtGte) as TSelect;
		}

		if (where.expiresAtLte) {
			query = query.where("ur.expiresAt", "<=", where.expiresAtLte) as TSelect;
		}

		if (where.expiresAtIsNull === true) {
			query = query.where("ur.expiresAt", "is", null) as TSelect;
		}

		if (where.expiresAtIsNull === false) {
			query = query.where("ur.expiresAt", "is not", null) as TSelect;
		}

		if (where.isExpired === true) {
			query = query
				.where("ur.expiresAt", "is not", null)
				.where("ur.expiresAt", "<=", now) as TSelect;
		}

		if (where.isExpired === false) {
			query = query.where((eb) =>
				eb.or([
					eb("ur.expiresAt", "is", null),
					eb("ur.expiresAt", ">", now),
				]),
			) as TSelect;
		}

		return yield* Effect.succeed(query);
	},
);
