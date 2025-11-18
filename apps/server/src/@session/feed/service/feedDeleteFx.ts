import { Effect } from "effect";
import type { WithDatabase } from "../../../database/WithDatabase";
import type { FeedQuerySchema } from "../schema/FeedQuerySchema";
import { feedFetchFx } from "./feedFetchFx";

export namespace feedDeleteFx {
	export interface Props {
		database: WithDatabase;
		userId: string;
		query: Omit<FeedQuerySchema.Type, "cursor" | "sort">;
	}
}

export const feedDeleteFx = ({ database, userId, query }: feedDeleteFx.Props) => {
	return Effect.gen(function* () {
		const feed = yield* feedFetchFx({
			database,
			userId,
			query,
		});

		yield* Effect.promise(async () => {
			return database
				.deleteFrom("feed")
				.where("id", "=", feed.id)
				.where("userId", "=", userId)
				.execute();
		});

		return feed;
	});
};

export type feedDeleteFx = ReturnType<typeof feedDeleteFx>;
