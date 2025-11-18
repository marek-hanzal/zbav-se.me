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

		yield* Effect.promise(async () => {
			const now = new Date();

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
				.returningAll()
				.executeTakeFirstOrThrow();
		});

		return yield* feedFetchFx({
			database,
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
