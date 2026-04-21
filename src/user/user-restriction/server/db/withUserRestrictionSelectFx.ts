import { Effect } from "effect";
import { sql } from "kysely";
import type { CategoryRestrictionEnumSchema } from "~/common/category/enum/CategoryRestrictionEnumSchema";
import { withUserRestrictionSourceSelectFx } from "./withUserRestrictionSourceSelectFx";

export namespace withUserRestrictionSelectFx {
	export interface Props extends withUserRestrictionSourceSelectFx.Props {
		//
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withUserRestrictionSelectFx>>;
}

export const withUserRestrictionSelectFx = Effect.fn("withUserRestrictionSelectFx")(function* ({
	sort,
}: withUserRestrictionSelectFx.Props) {
	const sourceSelect = yield* withUserRestrictionSourceSelectFx({
		sort,
	});

	return sourceSelect.select([
		"ur.id",
		"ur.createdAt",
		(eb) => {
			return sql<
				CategoryRestrictionEnumSchema.Type[]
			>`to_jsonb(${eb.ref("ur.restriction")})`.as("restriction");
		},
		"ur.availableAt",
	]);
});
