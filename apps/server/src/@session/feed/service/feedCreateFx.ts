import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import type { WithDatabase } from "../../../database/WithDatabase";
import type { FeedCreateSchema } from "../schema/FeedCreateSchema";
import { feedFetchFx } from "./feedFetchFx";

export namespace feedCreateFx {
	export interface Props {
		database: WithDatabase;
		userId: string;
		data: FeedCreateSchema.Type;
	}
}

export const feedCreateFx = ({
	database,
	userId,
	data: { name, locationId, query },
}: feedCreateFx.Props) => {
	return Effect.gen(function* () {
		const id = genId();
		const now = new Date();

		yield* Effect.promise(async () => {
			return database
				.insertInto("feed")
				.values({
					id,
					userId,
					locationId,
					name,
					query: JSON.stringify(query) as any,
					createdAt: now,
					updatedAt: now,
				})
				.execute();
		});

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

export type feedCreateFx = ReturnType<typeof feedCreateFx>;
