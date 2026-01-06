import { withCollectionFx } from "@use-pico/common/collection";
import { Effect } from "effect";
import { withIgnoreQueryBuilderFx } from "~/app/ignore/db/withIgnoreQueryBuilderFx";
import { withIgnoreSelectFx } from "~/app/ignore/db/withIgnoreSelectFx";
import type { IgnoreQuerySchema } from "~/app/ignore/schema/IgnoreQuerySchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";
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
	const user = yield* UserContextFx;

	return yield* withCollectionFx({
		select: yield* withIgnoreSelectFx({
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
		queryFx: withIgnoreQueryBuilderFx,
	});
});

export type ignoreCollectionFx = ReturnType<typeof ignoreCollectionFx>;
