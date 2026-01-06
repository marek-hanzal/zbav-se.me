import { withCountFx } from "@use-pico/common/count";
import { Effect } from "effect";
import { withIgnoreQueryBuilderFx } from "~/app/ignore/db/withIgnoreQueryBuilderFx";
import { withIgnoreSelectFx } from "~/app/ignore/db/withIgnoreSelectFx";
import type { IgnoreCountQuerySchema } from "~/app/ignore/schema/IgnoreCountQuerySchema";

export namespace ignoreCountFx {
	export type Props = IgnoreCountQuerySchema.Type;
}

export const ignoreCountFx = Effect.fn("ignoreCountFx")(function* ({
	filter,
	where,
}: ignoreCountFx.Props) {
	return yield* withCountFx({
		selectFx: withIgnoreSelectFx({}),
		filter,
		where: {
			...where,
		},
		queryFx: withIgnoreQueryBuilderFx,
	});
});

export type ignoreCountFx = ReturnType<typeof ignoreCountFx>;
