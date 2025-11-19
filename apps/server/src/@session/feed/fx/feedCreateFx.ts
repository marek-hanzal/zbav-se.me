import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { UserContextFx } from "../../../auth/UserContextFx";
import { DatabaseContextFx } from "../../../database/fx/DatabaseContextFx";
import type { FeedCreateSchema } from "../schema/FeedCreateSchema";
import { feedFetchFx } from "./feedFetchFx";

export namespace feedCreateFx {
	export interface Props {
		data: FeedCreateSchema.Type;
	}
}

export const feedCreateFx = ({ data: { name, locationId, query } }: feedCreateFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;

		const id = genId();

		yield* Effect.tryPromise(async () => {
			const now = new Date();

			return database
				.insertInto("feed")
				.values({
					id,
					userId: user.id,
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
			query: {
				where: {
					id,
				},
			},
		});
	});
};

export type feedCreateFx = ReturnType<typeof feedCreateFx>;
