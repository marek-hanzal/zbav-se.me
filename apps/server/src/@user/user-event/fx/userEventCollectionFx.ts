import { withCollection } from "@use-pico/common/collection";
import { Effect } from "effect";
import { withUserEventCollectionSelect } from "~/app/user-event/db/withUserEventCollectionSelect";
import { withUserEventQueryBuilder } from "~/app/user-event/db/withUserEventQueryBuilder";
import { UserEventDbSchema } from "~/app/user-event/schema/UserEventDbSchema";
import type { UserEventQuerySchema } from "~/app/user-event/schema/UserEventQuerySchema";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";

export namespace userEventCollectionFx {
	export type Props = UserEventQuerySchema.Type;
}

export const userEventCollectionFx = (query: userEventCollectionFx.Props) => {
	const { filter, where, cursor, sort } = query;
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;

		return yield* Effect.promise(async () => {
			return withCollection({
				select: withUserEventCollectionSelect({
					database,
					sort,
				}),
				output: UserEventDbSchema,
				cursor: cursor ?? {
					page: 0,
					size: 10,
				},
				filter,
				where,
				query: withUserEventQueryBuilder,
			});
		});
	});
};

export type userEventCollectionFx = ReturnType<typeof userEventCollectionFx>;
