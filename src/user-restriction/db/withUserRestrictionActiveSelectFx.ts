import { Effect } from "effect";
import { sql } from "kysely";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { RestrictionEnumSchema } from "~/restriction/schema/RestrictionEnumSchema";
import { withUserRestrictionSelectFx } from "~/user-restriction/db/withUserRestrictionSelectFx";

export namespace withUserRestrictionActiveSelectFx {
	export interface Props {
		userId?: string;
	}
}

export const withUserRestrictionActiveSelectFx = Effect.fn("withActiveUserRestrictionSelectFx")(
	function* ({ userId }: withUserRestrictionActiveSelectFx.Props) {
		const { kysely } = yield* KyselyContextFx;
		const fallbackSql = sql<RestrictionEnumSchema.Type>`${RestrictionEnumSchema.enum.none}::restriction_enum`;

		if (!userId) {
			return kysely.selectNoFrom(() => {
				return sql<RestrictionEnumSchema.Type>`${RestrictionEnumSchema.enum.none}::restriction_enum`.as(
					"restriction",
				);
			});
		}

		const { select, queryFx } = yield* withUserRestrictionSelectFx({
			sort: [
				{
					field: "availableAt",
					order: "desc",
				},
				{
					field: "createdAt",
					order: "desc",
				},
			],
		});

		return kysely.fn.coalesce(
			(yield* queryFx(select, {
				userId,
				isAvailable: true,
			}))
				.clearSelect()
				.select("ur.restriction")
				.limit(1),
			fallbackSql,
		);
	},
);
