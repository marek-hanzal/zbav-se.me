import { Effect } from "effect";
import { sql } from "kysely";
import { match } from "ts-pattern";
import { DateContextFx } from "@/lib/common/date";
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
	const dateContext = yield* DateContextFx;
	const now = dateContext.now().toJSDate();

	let query = kysely
		.selectFrom("user_resource_bundle as urb")
		.innerJoin("resource_bundle_limit as rbl", "rbl.resourceBundleId", "urb.resourceBundleId")
		.select([
			"rbl.id",
			"rbl.resourceDefinitionId",
			"urb.createdAt",
			"urb.availableAt",
			"urb.expiresAt",
			sql<number>`rbl.limit::float8`.as("limit"),
		])
		.where("urb.availableAt", "<=", now)
		.where((eb) => {
			return eb.or([
				eb("urb.expiresAt", "is", null),
				eb("urb.expiresAt", ">", now),
			]);
		});

	for (const item of sort) {
		query = match(item.field)
			.with("availableAt", () => query.orderBy("urb.availableAt", item.order))
			.with("createdAt", () => query.orderBy("urb.createdAt", item.order))
			.with("expiresAt", () => query.orderBy("urb.expiresAt", item.order))
			.with("limit", () => query.orderBy("rbl.limit", item.order))
			.with("resourceDefinitionId", () =>
				query.orderBy("rbl.resourceDefinitionId", item.order),
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
					query = query.where("rbl.id", "=", where.id);
				}

				if (where.userId) {
					query = query.where("urb.userId", "=", where.userId);
				}

				if (where.resourceDefinitionId) {
					query = query.where(
						"rbl.resourceDefinitionId",
						"=",
						where.resourceDefinitionId,
					);
				}

				if (where.resourceDefinitionIdIn && where.resourceDefinitionIdIn.length > 0) {
					query = query.where(
						"rbl.resourceDefinitionId",
						"in",
						where.resourceDefinitionIdIn,
					);
				}

				return yield* Effect.succeed(query);
			});
		},
	});
});
