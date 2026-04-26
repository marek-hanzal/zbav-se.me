import { Effect } from "effect";
import { sql } from "kysely";
import type { ListingDeliveryEnumSchema } from "~/common/listing/enum/ListingDeliveryEnumSchema";
import { withDraftSourceSelectFx } from "~/seller/draft/server/db/withDraftSourceSelectFx";
import type { LocationTableSchema } from "~/server/database/@table/LocationTableSchema";
import type { CategorySchema } from "~/user/category/server/schema/CategorySchema";
import { withActiveUserRestrictionSelectFx } from "~/user/user-restriction/server/db/withActiveUserRestrictionSelectFx";

export namespace withDraftSelectFx {
	export interface Props extends withDraftSourceSelectFx.Props {
		userId: string;
	}

	export type Select = ReturnType<typeof withDraftSelectFx>;
}

export const withDraftSelectFx = Effect.fn("withDraftSelectFx")(function* ({
	sort,
	userId,
}: withDraftSelectFx.Props) {
	const draftSourceSelect = yield* withDraftSourceSelectFx({
		sort,
	});

	const restrictionSql = yield* withActiveUserRestrictionSelectFx({
		userId,
	});

	return draftSourceSelect.selectAll("d").select((eb) => [
		sql<LocationTableSchema.Type | null>`to_jsonb(${eb.table("loc")}.*)`.as("location"),
		sql<CategorySchema.Type | null>`
			case
				when ${eb.ref("cat.id")} is null then null
				else to_jsonb(${eb.table("cat")}.*)
					|| jsonb_build_object(
						'isRestricted',
						${eb.ref("cat.restriction")} > ${restrictionSql}
					)
			end
		`.as("category"),
		sql<ListingDeliveryEnumSchema.Type[] | null>`to_jsonb(${eb.ref("d.delivery")})`.as(
			"delivery",
		),
		sql<string[] | null>`to_jsonb(${eb.ref("d.pros")})`.as("pros"),
		sql<string[] | null>`to_jsonb(${eb.ref("d.cons")})`.as("cons"),
	]);
});
