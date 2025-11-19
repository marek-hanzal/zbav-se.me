import { Effect } from "effect";
import { DatabaseContextFx } from "../../../database/fx/DatabaseContextFx";
import { withTransactionFx } from "../../../database/fx/withTransactionFx";
import { UserContextFx } from "../../../auth/UserContextFx";
import type { FeedPatchSchema } from "../schema/FeedPatchSchema";
import { feedFetchFx } from "./feedFetchFx";

export namespace feedPatchFx {
	export interface Props {
		data: FeedPatchSchema.Type;
	}
}

export const feedPatchFx = ({ data: { id, name, locationId, query } }: feedPatchFx.Props) => {
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
						query: query ? (JSON.stringify(query) as any) : null,
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
