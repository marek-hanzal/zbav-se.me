import { Effect } from "effect";
import { NotFoundError } from "../../../error/NotFoundError";
import { DatabaseContextFx } from "../../../fx/DatabaseContextFx";
import { UserContextFx } from "../../../fx/UserContextFx";
import type { FeedPatchSchema } from "../schema/FeedPatchSchema";
import { feedFetchFx } from "./feedFetchFx";

export namespace feedPatchFx {
	export interface Props {
		data: FeedPatchSchema.Type;
	}
}

export const feedPatchFx = ({ data: { id, name, locationId, query } }: feedPatchFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;

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
				.where("userId", "=", user.id)
				.executeTakeFirst();
		});

		if (!result.numUpdatedRows) {
			return yield* new NotFoundError({
				resource: "feed",
				resourceId: id,
				message: "Feed item not found",
			});
		}

		return yield* feedFetchFx({
			query: {
				where: {
					id,
				},
			},
		});
	});
};

export type feedPatchFx = ReturnType<typeof feedPatchFx>;
