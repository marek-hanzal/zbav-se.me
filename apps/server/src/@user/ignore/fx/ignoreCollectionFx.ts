import { withCollectionFx } from "@use-pico/common/collection";
import { Effect } from "effect";
import { withIgnoreQueryBuilder } from "~/app/ignore/db/withIgnoreQueryBuilder";
import { withIgnoreSelect } from "~/app/ignore/db/withIgnoreSelect";
import type { IgnoreQuerySchema } from "~/app/ignore/schema/IgnoreQuerySchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { IgnoreSchema } from "../schema/IgnoreSchema";

export namespace ignoreCollectionFx {
	export type Props = IgnoreQuerySchema.Type;
}

export const ignoreCollectionFx = Effect.fn("ignoreCollectionFx")(function* ({
	cursor,
	filter,
	where,
	sort,
}: ignoreCollectionFx.Props) {
	const database = yield* DatabaseContextFx;
	const user = yield* UserContextFx;

	return yield* withCollectionFx({
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

export type ignoreCollectionFx = ReturnType<typeof ignoreCollectionFx>;
