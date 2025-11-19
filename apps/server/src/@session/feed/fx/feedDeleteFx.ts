import { Effect } from "effect";
import { DatabaseContextFx } from "../../../database/fx/DatabaseContextFx";
import { withTransactionFx } from "../../../database/fx/withTransactionFx";
import { UserContextFx } from "../../../auth/UserContextFx";
import type { FeedQuerySchema } from "../schema/FeedQuerySchema";
import { feedFetchFx } from "./feedFetchFx";

export namespace feedDeleteFx {
	export interface Props {
		query: Omit<FeedQuerySchema.Type, "cursor" | "sort">;
	}
}

export const feedDeleteFx = ({ query }: feedDeleteFx.Props) => {
	return withTransactionFx(
		Effect.gen(function* () {
			const database = yield* DatabaseContextFx;
			const user = yield* UserContextFx;

			const feed = yield* feedFetchFx({
				query,
			});

			yield* Effect.tryPromise(async () => {
				return database
					.deleteFrom("feed")
					.where("id", "=", feed.id)
					.where("userId", "=", user.id)
					.execute();
			});

			return feed;
		}),
	);
};

export type feedDeleteFx = ReturnType<typeof feedDeleteFx>;
