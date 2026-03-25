import { Effect } from "effect";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import { withFeedSourceSelectFx } from "~/server/@buyer/feed/db/withFeedSourceSelectFx";

export namespace withFeedSelectFx {
	export interface Props extends withFeedSourceSelectFx.Props {}

	export type Select = Effect.Effect.Success<ReturnType<typeof withFeedSelectFx>>;
}

export const withFeedSelectFx = Effect.fn("withFeedSelectFx")(function* ({
	sort,
}: withFeedSelectFx.Props) {
	const sourceSelect = yield* withFeedSourceSelectFx({
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
		);
});
