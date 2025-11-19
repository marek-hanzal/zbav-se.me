import { Effect } from "effect";
import { DatabaseContextFx } from "../../../service/DatabaseContextFx";
import { UserContextFx } from "../../../service/UserContextFx";
import type { FeedQuerySchema } from "../schema/FeedQuerySchema";
import { feedFetchFx } from "./feedFetchFx";

export namespace feedDeleteFx {
	export interface Props {
		query: Omit<FeedQuerySchema.Type, "cursor" | "sort">;
	}
}

export const feedDeleteFx = ({ query }: feedDeleteFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;

		const feed = yield* feedFetchFx({
			query,
		});

		yield* Effect.promise(async () => {
			return database
				.deleteFrom("feed")
				.where("id", "=", feed.id)
				.where("userId", "=", user.id)
				.execute();
		});

		return feed;
	});
};

export type feedDeleteFx = ReturnType<typeof feedDeleteFx>;
