import { Effect } from "effect";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import { withFeedFavouriteSourceSelectFx } from "~/client/@buyer/feed-favourite/server/db/withFeedFavouriteSourceSelectFx";

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
		.selectAll()
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
});
