import { withCountFx } from "@use-pico/common/count";
import type { AssertNever } from "@use-pico/common/type";
import { Effect } from "effect";
import { withIgnoreQueryBuilderFx } from "~/app/ignore/db/withIgnoreQueryBuilderFx";
import { withIgnoreSelectFx } from "~/app/ignore/db/withIgnoreSelectFx";
import type { IgnoreCountQuerySchema } from "~/app/ignore/schema/IgnoreCountQuerySchema";
import type { IgnoreFilterSchema } from "~/app/ignore/schema/IgnoreFilterSchema";
import type { UserContextFx } from "~/auth/fx/UserContextFx";

export namespace ignoreCountFx {
	export interface Props extends IgnoreCountQuerySchema.Type {
		scope: IgnoreFilterSchema.Type;
	}
}

export const ignoreCountFx = Effect.fn("ignoreCountFx")(function* ({
	filter,
	where,
	scope,
}: ignoreCountFx.Props) {
	return yield* withCountFx({
		selectFx: withIgnoreSelectFx({}),
		filter,
		where,
		scope,
		queryFx: withIgnoreQueryBuilderFx,
	});
});

export type ignoreCountFx = ReturnType<typeof ignoreCountFx>;

type _NoUser = AssertNever<Extract<Effect.Effect.Context<ignoreCountFx>, UserContextFx>>;
