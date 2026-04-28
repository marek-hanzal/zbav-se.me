import { Effect } from "effect";
import { withListingSourceSelectFx } from "~/seller/listing/server/db/withListingSourceSelectFx";
import { withActiveUserRestrictionSelectFx } from "~/user/user-restriction/server/db/withActiveUserRestrictionSelectFx";

export namespace withListingSelectFx {
	export interface Props extends withListingSourceSelectFx.Props {
		userId: string;
	}

	export type Select = ReturnType<typeof withListingSelectFx>;
}

export const withListingSelectFx = Effect.fn("withListingSelectFx")(function* ({
	sort,
	userId,
}: withListingSelectFx.Props) {
	const listingSourceSelect = yield* withListingSourceSelectFx({
		sort,
	});

	const restrictionSql = yield* withActiveUserRestrictionSelectFx({
		userId,
	});

	return listingSourceSelect.select([
		"l.id",
		"l.categoryId",
		"l.restriction",
		"l.withImageUrl",
		"l.expiresAt",
		"l.createdAt",
		"l.updatedAt",
	]);
});
