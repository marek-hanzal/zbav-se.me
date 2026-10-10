import { Effect } from "effect";
import { match } from "ts-pattern";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { selectFn } from "~/database-query/fn/selectFn";
import { DateServiceFx } from "~/date/service/DateServiceFx";
import type { UserRestrictionSortSchema } from "~/user-restriction/schema/UserRestrictionSortSchema";
import type { UserRestrictionWhereSchema } from "~/user-restriction/schema/UserRestrictionWhereSchema";

export namespace withUserRestrictionSelectFx {
	export interface Props {
		sort?: UserRestrictionSortSchema.Type[];
	}
}

export const withUserRestrictionSelectFx = Effect.fn("withUserRestrictionSelectFx")(function* ({
	sort,
}: withUserRestrictionSelectFx.Props) {
	const { kysely } = yield* KyselyContextFx;
	const dateService = yield* DateServiceFx;
	const now = dateService.nowFn().toJSDate();

	let select = kysely.selectFrom("user_restriction as ur");

	for (const item of sort ?? []) {
		select = match(item.field)
			.with("availableAt", () => select.orderBy("ur.availableAt", item.order))
			.with("createdAt", () => select.orderBy("ur.createdAt", item.order))
			.with("expiresAt", () => select.orderBy("ur.expiresAt", item.order))
			.with("id", () => select.orderBy("ur.id", item.order))
			.exhaustive();
	}

	return selectFn({
		select: select
			.select([
				"ur.id",
				"ur.createdAt",
				"ur.restriction",
				"ur.availableAt",
				"ur.expiresAt",
			])
			.select((ebFn) => {
				return ebFn.fn
					.coalesce(
						ebFn.and([
							ebFn("ur.availableAt", "<=", now),
							ebFn.or([
								ebFn("ur.expiresAt", "is", null),
								ebFn("ur.expiresAt", ">", now),
							]),
						]),
						ebFn.lit(false),
					)
					.$castTo<boolean>()
					.as("isAvailable");
			}),
		queryFx(select, where: UserRestrictionWhereSchema.Type) {
			return Effect.gen(function* () {
				const dateService = yield* DateServiceFx;
				const now = dateService.nowFn().toJSDate();

				let query = select;

				if (!where) {
					return yield* Effect.succeed(select);
				}

				if (where.id) {
					query = query.where("ur.id", "=", where.id);
				}

				if (where.idIn && where.idIn.length > 0) {
					query = query.where("ur.id", "in", where.idIn);
				}

				if (where.userId) {
					query = query.where("ur.userId", "=", where.userId);
				}

				if (where.restriction) {
					query = query.where("ur.restriction", "=", where.restriction);
				}

				if (where.isAvailable === true) {
					query = query.where("ur.availableAt", "<=", now).where((ebFn) => {
						return ebFn.or([
							ebFn("ur.expiresAt", "is", null),
							ebFn("ur.expiresAt", ">", now),
						]);
					});
				}

				if (where.isAvailable === false) {
					query = query.where((ebFn) => {
						return ebFn.or([
							ebFn("ur.availableAt", ">", now),
							ebFn.and([
								ebFn("ur.expiresAt", "is not", null),
								ebFn("ur.expiresAt", "<=", now),
							]),
						]);
					});
				}

				if (where.availableAtGte) {
					query = query.where("ur.availableAt", ">=", where.availableAtGte);
				}

				if (where.availableAtLte) {
					query = query.where("ur.availableAt", "<=", where.availableAtLte);
				}

				if (where.expiresAtGte) {
					query = query.where("ur.expiresAt", ">=", where.expiresAtGte);
				}

				if (where.expiresAtLte) {
					query = query.where("ur.expiresAt", "<=", where.expiresAtLte);
				}

				if (where.expiresAtIsNull === true) {
					query = query.where("ur.expiresAt", "is", null);
				}

				if (where.expiresAtIsNull === false) {
					query = query.where("ur.expiresAt", "is not", null);
				}

				if (where.isExpired === true) {
					query = query
						.where("ur.expiresAt", "is not", null)
						.where("ur.expiresAt", "<=", now);
				}

				if (where.isExpired === false) {
					query = query.where((ebFn) => {
						return ebFn.or([
							ebFn("ur.expiresAt", "is", null),
							ebFn("ur.expiresAt", ">", now),
						]);
					});
				}

				return yield* Effect.succeed(query);
			});
		},
	});
});
