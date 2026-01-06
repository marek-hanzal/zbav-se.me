import { withCountFx } from "@use-pico/common/count";
import type { AssertNever } from "@use-pico/common/type";
import { Effect } from "effect";
import { withUploadQueryBuilderFx } from "~/app/upload/db/withUploadQueryBuilderFx";
import { withUploadSelectFx } from "~/app/upload/db/withUploadSelectFx";
import type { UploadCountQuerySchema } from "~/app/upload/schema/UploadCountQuerySchema";
import type { UploadFilterSchema } from "~/app/upload/schema/UploadFilterSchema";
import type { UserContextFx } from "~/auth/fx/UserContextFx";

export namespace uploadCountFx {
	export interface Props extends UploadCountQuerySchema.Type {
		scope?: UploadFilterSchema.Type;
	}
}

export const uploadCountFx = Effect.fn("uploadCountFx")(function* ({
	filter,
	where,
	scope,
}: uploadCountFx.Props) {
	return yield* withCountFx({
		selectFx: withUploadSelectFx({}),
		filter,
		where,
		scope,
		queryFx: withUploadQueryBuilderFx,
	});
});

export type uploadCountFx = ReturnType<typeof uploadCountFx>;

type _NoUser = AssertNever<Extract<Effect.Effect.Context<uploadCountFx>, UserContextFx>>;
