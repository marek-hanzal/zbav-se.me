import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import type { FeedCreateSchema } from "~/@user/feed/schema/FeedCreateSchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { feedFetchFx } from "./feedFetchFx";

export namespace feedCreateFx {
	export interface Props {
		data: FeedCreateSchema.Type;
	}
}

export const feedCreateFx = Effect.fn("feedCreateFx")(function* ({
	data: { name, locationId, query },
}: feedCreateFx.Props) {
	return yield* withTransactionFx(
		Effect.gen(function* () {
			const database = yield* DatabaseContextFx;
			const user = yield* UserContextFx;

			const id = genId();

			yield* Effect.promise(async () => {
				const now = new Date();

				return database
					.insertInto("feed")
					.values({
						id,
						userId: user.id,
						locationId,
						uploadId: null,
						name,
						query: JSON.stringify(query) as any,
						createdAt: now,
						updatedAt: now,
					})
					.returningAll()
					.executeTakeFirstOrThrow();
			});

			return yield* feedFetchFx({
				where: {
					id,
				},
			});
		}),
	);
});

export type feedCreateFx = ReturnType<typeof feedCreateFx>;
