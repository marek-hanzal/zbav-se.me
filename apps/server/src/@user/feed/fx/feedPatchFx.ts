import { Effect } from "effect";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import type { FeedPatchSchema } from "../schema/FeedPatchSchema";
import { feedFetchFx } from "./feedFetchFx";

export namespace feedPatchFx {
	export type Props = FeedPatchSchema.Type;
}

export const feedPatchFx = ({ id, name, locationId, uploadId, query }: feedPatchFx.Props) => {
	return withTransactionFx(
		Effect.gen(function* () {
			const database = yield* DatabaseContextFx;
			const user = yield* UserContextFx;

			const now = new Date();

			yield* Effect.tryPromise(async () => {
				return database
					.updateTable("feed")
					.set({
						name,
						locationId,
						uploadId,
						query: query ? (JSON.stringify(query) as any) : undefined,
						updatedAt: now,
					})
					.where("id", "=", id)
					.where("userId", "=", user.id)
					.executeTakeFirst();
			});

			return yield* feedFetchFx({
				query: {
					where: {
						id,
					},
				},
			});
		}),
	);
};

export type feedPatchFx = ReturnType<typeof feedPatchFx>;
