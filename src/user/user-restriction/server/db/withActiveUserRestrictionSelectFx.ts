import { Effect } from "effect";
import { DateContextFx } from "@/lib/common/date";
import { withUserRestrictionSourceSelectFx } from "~/user/user-restriction/server/db/withUserRestrictionSourceSelectFx";

export namespace withActiveUserRestrictionSelectFx {
	export interface Props {
		userId: string;
	}

	export type Select = Effect.Effect.Success<
		ReturnType<typeof withActiveUserRestrictionSelectFx>
	>;
}

export const withActiveUserRestrictionSelectFx = Effect.fn("withActiveUserRestrictionSelectFx")(
	function* ({ userId }: withActiveUserRestrictionSelectFx.Props) {
		const dateContext = yield* DateContextFx;
		const now = dateContext.now().toJSDate();
		const sourceSelect = yield* withUserRestrictionSourceSelectFx({});

		return sourceSelect
			.clearSelect()
			.select("ur.restriction")
			.where("ur.userId", "=", userId)
			.where("ur.availableAt", "<=", now)
			.where((eb) =>
				eb.or([
					eb("ur.expiresAt", "is", null),
					eb("ur.expiresAt", ">", now),
				]),
			)
			.orderBy("ur.availableAt", "desc")
			.orderBy("ur.createdAt", "desc")
			.limit(1);
	},
);
