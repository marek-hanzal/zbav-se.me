import { withCollection } from "@use-pico/common/collection";
import { Effect } from "effect";
import { withIgnoreQueryBuilder } from "~/app/ignore/db/withIgnoreQueryBuilder";
import { withIgnoreSelect } from "~/app/ignore/db/withIgnoreSelect";
import type { IgnoreQuerySchema } from "~/app/ignore/schema/IgnoreQuerySchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { IgnoreSchema } from "../schema/IgnoreSchema";

export namespace ignoreCollectionFx {
	export interface Props {
		query: IgnoreQuerySchema.Type;
	}
}

export const ignoreCollectionFx = ({
	query: { cursor, filter, where, sort },
}: ignoreCollectionFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;

		return yield* Effect.tryPromise(async () => {
			return withCollection({
				select: withIgnoreSelect({
					database,
					sort,
				}),
				output: IgnoreSchema,
				cursor: cursor ?? {
					page: 0,
					size: 10,
				},
				filter,
				where: {
					...where,
					userId: user.id,
				},
				query: withIgnoreQueryBuilder,
			});
		});
	});
};

export type ignoreCollectionFx = ReturnType<typeof ignoreCollectionFx>;
