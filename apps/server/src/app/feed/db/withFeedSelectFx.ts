import { Effect } from "effect";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import { match } from "ts-pattern";
import type { FeedSortSchema } from "~/app/feed/schema/FeedSortSchema";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";

export namespace withFeedSelectFx {
	export interface Props {
		sort: FeedSortSchema.Type[] | undefined;
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withFeedSelectFx>>;
}

export const withFeedSelectFx = Effect.fn("withFeedSelectFx")(function* ({
	sort,
}: withFeedSelectFx.Props) {
	const database = yield* DatabaseContextFx;
	let query = database
		.selectFrom("feed as f")
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

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("f.createdAt", item.direction))
			.with("updatedAt", () => query.orderBy("f.updatedAt", item.direction))
			.exhaustive();
	}

	return query;
});
