import { Effect } from "effect";
import type { WithDatabase } from "../../../database/WithDatabase";
import { NotFoundError } from "../../../error/NotFoundError";
import type { FeedPatchSchema } from "../schema/FeedPatchSchema";
import { feedFetchFx } from "./feedFetchFx";

export namespace feedPatchFx {
	export interface Props {
		database: WithDatabase;
		userId: string;
		data: FeedPatchSchema.Type;
	}
}

export const feedPatchFx = ({
	database,
	userId,
	data: { id, name, locationId, query },
}: feedPatchFx.Props) => {
	return Effect.gen(function* () {
		const now = new Date();

		const result = yield* Effect.promise(async () => {
			return database
				.updateTable("feed")
				.set({
					name,
					locationId,
					query: query ? (JSON.stringify(query) as any) : null,
					updatedAt: now,
				})
				.where("id", "=", id)
				.where("userId", "=", userId)
				.executeTakeFirst();
		});

		if (!result.numUpdatedRows) {
			return yield* Effect.fail(
				new NotFoundError({
					resource: "feed",
					resourceId: id,
					message: "Feed item not found",
				}),
			);
		}

		return yield* feedFetchFx({
			userId,
			query: {
				where: {
					id,
				},
			},
		});
	});
};

export type feedPatchFx = ReturnType<typeof feedPatchFx>;
