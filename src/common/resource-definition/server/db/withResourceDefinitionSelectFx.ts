import { Effect } from "effect";
import { match } from "ts-pattern";
import { selectFx } from "@/lib/common/select";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import type { ResourceDefinitionSortSchema } from "../schema/ResourceDefinitionSortSchema";
import type { ResourceDefinitionWhereSchema } from "../schema/ResourceDefinitionWhereSchema";

export namespace withResourceDefinitionSelectFx {
	export interface Props {
		sort?: ResourceDefinitionSortSchema.Type[];
	}
}

export const withResourceDefinitionSelectFx = Effect.fn("withResourceDefinitionSelectFx")(
	function* ({ sort }: withResourceDefinitionSelectFx.Props) {
		const { kysely } = yield* KyselyContextFx;

		let query = kysely.selectFrom("resource_definition as rd").select([
			"rd.name",
			"rd.name as id",
		]);

		for (const item of sort ?? []) {
			query = match(item.field)
				.with("name", () => query.orderBy("rd.name", item.order))
				.exhaustive();
		}

		return selectFx({
			select: query,
			queryFx(select, where: ResourceDefinitionWhereSchema.Type) {
				return Effect.gen(function* () {
					let query = select;

					if (!where) {
						return yield* Effect.succeed(query);
					}

					if (where.name) {
						query = query.where("rd.name", "=", where.name);
					}

					if (where.nameIn && where.nameIn.length > 0) {
						query = query.where("rd.name", "in", where.nameIn);
					}

					return yield* Effect.succeed(query);
				});
			},
		});
	},
);
