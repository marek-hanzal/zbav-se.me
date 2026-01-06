import { withCollectionFx } from "@use-pico/common/collection";
import type { AssertNever } from "@use-pico/common/type";
import { Effect } from "effect";
import { withUploadQueryBuilderFx } from "~/app/upload/db/withUploadQueryBuilderFx";
import { withUploadSelectFx } from "~/app/upload/db/withUploadSelectFx";
import type { UploadFilterSchema } from "~/app/upload/schema/UploadFilterSchema";
import type { UploadQuerySchema } from "~/app/upload/schema/UploadQuerySchema";
import type { UserContextFx } from "~/auth/fx/UserContextFx";

export namespace uploadCollectionFx {
	export interface Props extends UploadQuerySchema.Type {
		scope?: UploadFilterSchema.Type;
	}
}

export const uploadCollectionFx = Effect.fn("uploadCollectionFx")(function* ({
	cursor,
	filter,
	where,
	scope,
	sort,
}: uploadCollectionFx.Props) {
	return yield* withCollectionFx({
		selectFx: withUploadSelectFx({
			sort,
		}),
		cursor: cursor ?? {
			page: 0,
			size: 10,
		},
		filter,
		where,
		scope,
		queryFx: withUploadQueryBuilderFx,
	});
});

export type uploadCollectionFx = ReturnType<typeof uploadCollectionFx>;

type _NoUser = AssertNever<Extract<Effect.Effect.Context<uploadCollectionFx>, UserContextFx>>;
