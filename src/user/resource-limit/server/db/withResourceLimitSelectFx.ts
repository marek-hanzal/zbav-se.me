import { Effect } from "effect";
import { sql } from "kysely";
import { match } from "ts-pattern";
import { DateServiceFx } from "@/lib/common/date";
import { selectFx } from "@/lib/common/select";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import type { ResourceLimitSortSchema } from "../schema/ResourceLimitSortSchema";
import type { ResourceLimitWhereSchema } from "../schema/ResourceLimitWhereSchema";

export namespace withResourceLimitSelectFx {
	export interface Props {
		sort?: ResourceLimitSortSchema.Type[];
	}
}

export const withResourceLimitSelectFx = Effect.fn("withResourceLimitSelectFx")(function* ({
	sort = [
		{
			field: "createdAt",
			order: "desc",
		},
	],
}: withResourceLimitSelectFx.Props) {
	const { kysely } = yield* KyselyContextFx;
	const dateService = yield* DateServiceFx;
	const now = dateService.now().toJSDate();

	let query = kysely
		.selectFrom("user_resource_bundle_limit as resourceLimit")
		.innerJoin(
			"user_resource_bundle as assignment",
			"assignment.id",
			"resourceLimit.userResourceBundleId",
		)
		.select([
			"resourceLimit.id",
			"resourceLimit.resourceDefinitionId",
			"resourceLimit.createdAt",
			"resourceLimit.availableAt",
			sql<Date | null>`${sql.ref("resourceLimit.expiresAt")}`.as("expiresAt"),
			sql<number>`${sql.ref("resourceLimit.limit")}::float8`.as("limit"),
		])
		.where("resourceLimit.availableAt", "<=", now)
		.where((eb) => {
			return eb.or([
				eb("resourceLimit.expiresAt", "is", null),
				eb("resourceLimit.expiresAt", ">", now),
			]);
		});

	for (const item of sort) {
		query = match(item.field)
			.with("availableAt", () => query.orderBy("resourceLimit.availableAt", item.order))
			.with("createdAt", () => query.orderBy("resourceLimit.createdAt", item.order))
			.with("expiresAt", () => query.orderBy("resourceLimit.expiresAt", item.order))
			.with("limit", () => query.orderBy("resourceLimit.limit", item.order))
			.with("resourceDefinitionId", () =>
				query.orderBy("resourceLimit.resourceDefinitionId", item.order),
			)
			.exhaustive();
	}

	return selectFx({
		select: query,
		queryFx(select, where: ResourceLimitWhereSchema.Type) {
			return Effect.gen(function* () {
				let query = select;

				if (!where) {
					return yield* Effect.succeed(query);
				}

				if (where.id) {
					query = query.where("resourceLimit.id", "=", where.id);
				}

				if (where.userId) {
					query = query.where("assignment.userId", "=", where.userId);
				}

				if (where.resourceDefinitionId) {
					query = query.where(
						"resourceLimit.resourceDefinitionId",
						"=",
						where.resourceDefinitionId,
					);
				}

				if (where.resourceDefinitionIdIn && where.resourceDefinitionIdIn.length > 0) {
					query = query.where(
						"resourceLimit.resourceDefinitionId",
						"in",
						where.resourceDefinitionIdIn,
					);
				}

				return yield* Effect.succeed(query);
			});
		},
	});
});
