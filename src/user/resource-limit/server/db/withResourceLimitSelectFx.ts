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
		.selectFrom("user_resource_bundle_limit as urbl")
		.innerJoin("user_resource_bundle as urb", "urb.id", "urbl.userResourceBundleId")
		.select([
			"urbl.id",
			"urbl.resourceDefinitionId",
			"urbl.createdAt",
			"urbl.availableAt",
			"urbl.expiresAt",
			sql<number>`urbl.limit::float8`.as("limit"),
		])
		.where("urbl.availableAt", "<=", now)
		.where((eb) => {
			return eb.or([
				eb("urbl.expiresAt", "is", null),
				eb("urbl.expiresAt", ">", now),
			]);
		});

	for (const item of sort) {
		query = match(item.field)
			.with("availableAt", () => query.orderBy("urbl.availableAt", item.order))
			.with("createdAt", () => query.orderBy("urbl.createdAt", item.order))
			.with("expiresAt", () => query.orderBy("urbl.expiresAt", item.order))
			.with("limit", () => query.orderBy("urbl.limit", item.order))
			.with("resourceDefinitionId", () =>
				query.orderBy("urbl.resourceDefinitionId", item.order),
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
					query = query.where("urbl.id", "=", where.id);
				}

				if (where.userId) {
					query = query.where("urb.userId", "=", where.userId);
				}

				if (where.resourceDefinitionId) {
					query = query.where(
						"urbl.resourceDefinitionId",
						"=",
						where.resourceDefinitionId,
					);
				}

				if (where.resourceDefinitionIdIn && where.resourceDefinitionIdIn.length > 0) {
					query = query.where(
						"urbl.resourceDefinitionId",
						"in",
						where.resourceDefinitionIdIn,
					);
				}

				return yield* Effect.succeed(query);
			});
		},
	});
});
