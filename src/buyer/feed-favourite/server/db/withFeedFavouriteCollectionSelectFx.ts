import { Effect } from "effect";
import { sql } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import { withFeedFavouriteSourceSelectFx } from "~/buyer/feed-favourite/server/db/withFeedFavouriteSourceSelectFx";
import type { ListingQuerySchema } from "~/buyer/listing/server/schema/ListingQuerySchema";

export namespace withFeedFavouriteCollectionSelectFx {
	export interface Props extends withFeedFavouriteSourceSelectFx.Props {
		//
	}

	export type Select = Effect.Effect.Success<
		ReturnType<typeof withFeedFavouriteCollectionSelectFx>
	>;
}

export const withFeedFavouriteCollectionSelectFx = Effect.fn("withFeedFavouriteCollectionSelectFx")(
	function* ({ userId, sort }: withFeedFavouriteCollectionSelectFx.Props) {
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
					.select((eb) => eb.fn.count<number>("favourite.id").$notNull().as("count"))
					.whereRef("favourite.feedId", "=", "f.id")
					.where("favourite.userId", "=", userId)
					.$asScalar()
					.$notNull()
					.as("count"),
			);
	},
);
