import { Effect } from "effect";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import { withFeedSourceSelectFx } from "~/buyer/feed/server/db/withFeedSourceSelectFx";
import type { ListingQuerySchema } from "~/buyer/listing/server/schema/ListingQuerySchema";

export namespace withFeedSelectFx {
	export interface Props extends withFeedSourceSelectFx.Props {
		//
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withFeedSelectFx>>;
}

export const withFeedSelectFx = Effect.fn("withFeedSelectFx")(function* ({
	sort,
}: withFeedSelectFx.Props) {
	const sourceSelect = yield* withFeedSourceSelectFx({
		sort,
	});

	return sourceSelect
		.select([
			"f.id",
			"f.userId",
			"f.uploadId",
			"f.type",
			"f.name",
			"f.createdAt",
			"f.updatedAt",
		])
		.select((eb) => eb.ref("f.query").$castTo<ListingQuerySchema.Type>().as("query"))
		.select((eb) =>
			jsonObjectFrom(
				eb
					.selectFrom("upload as u")
					.selectAll()
					.whereRef("u.id", "=", "f.uploadId")
					.limit(1),
			).as("upload"),
		);
});
