import { Effect } from "effect";
import { sql } from "kysely";
import { match } from "ts-pattern";
import { DateContextFx } from "@/lib/common/date";
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
		const dateContext = yield* DateContextFx;
		const now = dateContext.now().toJSDate();

		let query = kysely.selectFrom("user_restriction as ur");

		for (const item of sort ?? []) {
			query = match(item.field)
				.with("availableAt", () => query.orderBy("ur.availableAt", item.order))
				.with("createdAt", () => query.orderBy("ur.createdAt", item.order))
				.with("expiresAt", () => query.orderBy("ur.expiresAt", item.order))
				.with("id", () => query.orderBy("ur.id", item.order))
				.exhaustive();
		}

		return query.select((eb) => [
			"ur.id",
			"ur.createdAt",
			"ur.restriction",
			"ur.availableAt",
			"ur.expiresAt",
			sql<boolean>`
				coalesce(${eb.ref("ur.availableAt")} <= ${eb.val(now)}, false)
				and (${eb.ref("ur.expiresAt")} is null or ${eb.ref("ur.expiresAt")} > ${eb.val(now)})
			`.as("isAvailable"),
		]);
	},
);
