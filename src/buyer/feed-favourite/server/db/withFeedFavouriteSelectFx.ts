import { Effect } from "effect";
import { sql } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import { withFeedFavouriteSourceSelectFx } from "~/buyer/feed-favourite/server/db/withFeedFavouriteSourceSelectFx";
import type { ListingQuerySchema } from "~/buyer/listing/server/schema/ListingQuerySchema";

export namespace withFeedFavouriteSelectFx {
	export interface Props extends withFeedFavouriteSourceSelectFx.Props {
		//
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withFeedFavouriteSelectFx>>;
}

export const withFeedFavouriteSelectFx = Effect.fn("withFeedFavouriteSelectFx")(function* ({
	userId,
	sort,
}: withFeedFavouriteSelectFx.Props) {
	const sourceSelect = yield* withFeedFavouriteSourceSelectFx({
		userId,
		sort,
	});

	return sourceSelect
		.select([
			"f.id",
			"f.userId",
			"f.locationId",
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
		)
		.select((eb) =>
			eb
				.selectFrom("favourite")
				.select(sql<number>`count(*)::int`.as("count"))
				.whereRef("favourite.feedId", "=", "f.id")
				.where("favourite.userId", "=", userId)
				.$asScalar()
				.$notNull()
				.as("count"),
		);
});
