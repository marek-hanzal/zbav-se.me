import { Effect } from "effect";
import { match } from "ts-pattern";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import type { UserRestrictionSortSchema } from "../schema/UserRestrictionSortSchema";

export namespace withUserRestrictionSourceSelectFx {
	export interface Props {
		sort?: UserRestrictionSortSchema.Type[];
	}

	export type Select = Effect.Effect.Success<
		ReturnType<typeof withUserRestrictionSourceSelectFx>
	>;
}

export const withUserRestrictionSourceSelectFx = Effect.fn("withUserRestrictionSourceSelectFx")(
	function* ({ sort }: withUserRestrictionSourceSelectFx.Props) {
		const { kysely } = yield* KyselyContextFx;

		let query = kysely
			.selectFrom("user_restriction as ur")
			.where("ur.availableAt", "is not", null);

		for (const item of sort ?? []) {
			query = match(item.field)
				.with("availableAt", () => query.orderBy("ur.availableAt", item.order))
				.with("createdAt", () => query.orderBy("ur.createdAt", item.order))
				.with("id", () => query.orderBy("ur.id", item.order))
				.exhaustive();
		}

		return query;
	},
);
