import { Effect } from "effect";
import { sql } from "kysely";
import { match } from "ts-pattern";
import { DateContextFx } from "@/lib/common/date";
import { selectFx } from "@/lib/common/select";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import type { UserResourceLimitSortSchema } from "../schema/UserResourceLimitSortSchema";
import type { UserResourceLimitWhereSchema } from "../schema/UserResourceLimitWhereSchema";

export namespace withUserResourceLimitSelectFx {
	export interface Props {
		sort?: UserResourceLimitSortSchema.Type[];
	}
}

export const withUserResourceLimitSelectFx = Effect.fn("withUserResourceLimitSelectFx")(function* ({
	sort,
}: withUserResourceLimitSelectFx.Props) {
	const { kysely } = yield* KyselyContextFx;
	const dateContext = yield* DateContextFx;
	const now = dateContext.now().toJSDate();

	let query = kysely
		.selectFrom("user_resource_limit as url")
		.select([
			"url.id",
			"url.resourceDefinitionId",
			"url.reference",
			"url.createdAt",
			"url.availableAt",
			"url.expiresAt",
			sql<number>`url.limit::float8`.as("limit"),
		])
		.where("url.availableAt", "<=", now)
		.where((eb) =>
			eb.or([
				eb("url.expiresAt", "is", null),
				eb("url.expiresAt", ">", now),
			]),
		)
		.where((eb) =>
			eb.not(
				eb.exists(
					eb
						.selectFrom("user_resource_limit as newer")
						.select("newer.userId")
						.whereRef("newer.userId", "=", "url.userId")
						.whereRef("newer.resourceDefinitionId", "=", "url.resourceDefinitionId")
						.where((eb) =>
							eb.or([
								eb.and([
									eb("newer.reference", "is", null),
									eb("url.reference", "is", null),
								]),
								eb("newer.reference", "=", eb.ref("url.reference")),
							]),
						)
						.where("newer.availableAt", "<=", now)
						.where((eb) =>
							eb.or([
								eb("newer.expiresAt", "is", null),
								eb("newer.expiresAt", ">", now),
							]),
						)
						.where((eb) =>
							eb.or([
								eb("newer.availableAt", ">", eb.ref("url.availableAt")),
								eb.and([
									eb("newer.availableAt", "=", eb.ref("url.availableAt")),
									eb("newer.createdAt", ">", eb.ref("url.createdAt")),
								]),
							]),
						),
				),
			),
		);

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("availableAt", () => query.orderBy("url.availableAt", item.order))
			.with("createdAt", () => query.orderBy("url.createdAt", item.order))
			.with("expiresAt", () => query.orderBy("url.expiresAt", item.order))
			.with("limit", () => query.orderBy("url.limit", item.order))
			.with("reference", () => query.orderBy("url.reference", item.order))
			.with("resourceDefinitionId", () =>
				query.orderBy("url.resourceDefinitionId", item.order),
			)
			.exhaustive();
	}

	return selectFx({
		select: query,
		queryFx(select, where: UserResourceLimitWhereSchema.Type) {
			return Effect.gen(function* () {
				let query = select;

				if (!where) {
					return yield* Effect.succeed(query);
				}

				if (where.id) {
					query = query.where("url.id", "=", where.id);
				}

				if (where.userId) {
					query = query.where("url.userId", "=", where.userId);
				}

				if (where.resourceDefinitionId) {
					query = query.where(
						"url.resourceDefinitionId",
						"=",
						where.resourceDefinitionId,
					);
				}

				if (where.resourceDefinitionIdIn && where.resourceDefinitionIdIn.length > 0) {
					query = query.where(
						"url.resourceDefinitionId",
						"in",
						where.resourceDefinitionIdIn,
					);
				}

				if (where.reference) {
					const reference = where.reference;

					query = query.where((eb) => {
						return eb.or([
							eb("url.reference", "=", reference),
							eb.and([
								eb("url.reference", "is", null),
								eb.not(
									eb.exists(
										eb
											.selectFrom("user_resource_limit as override")
											.select("override.userId")
											.whereRef("override.userId", "=", "url.userId")
											.whereRef(
												"override.resourceDefinitionId",
												"=",
												"url.resourceDefinitionId",
											)
											.where("override.reference", "=", reference)
											.where("override.availableAt", "<=", now)
											.where((eb) =>
												eb.or([
													eb("override.expiresAt", "is", null),
													eb("override.expiresAt", ">", now),
												]),
											),
									),
								),
							]),
						]);
					});
				}

				return yield* Effect.succeed(query);
			});
		},
	});
});
