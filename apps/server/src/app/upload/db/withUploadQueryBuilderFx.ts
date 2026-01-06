import { Effect } from "effect";
import type { UploadFilterSchema } from "~/app/upload/schema/UploadFilterSchema";
import type { withUploadSelectFx } from "./withUploadSelectFx";

export namespace withUploadQueryBuilderFx {
	export interface Props {
		select: withUploadSelectFx.Select;
		where?: UploadFilterSchema.Type;
	}

	export type Callback = (props: Props) => withUploadSelectFx.Select;
}

export const withUploadQueryBuilderFx = Effect.fn("withUploadQueryBuilderFx")(function* ({
	select,
	where,
}: withUploadQueryBuilderFx.Props) {
	let query = select;

	if (where.id) {
		query = query.where("u.id", "=", where.id);
	}

	if (where.idIn && where.idIn.length > 0) {
		query = query.where("u.id", "in", where.idIn);
	}

	return yield* Effect.succeed(query);
});
