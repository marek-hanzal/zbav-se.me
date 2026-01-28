import { Effect } from "effect";
import type { UploadFilterSchema } from "~/@user/upload/schema/UploadFilterSchema";
import type { withUploadSourceSelectFx } from "~/@user/upload/db/withUploadSourceSelectFx";

export namespace withUploadQueryBuilderFx {
	export interface Props<
		TSelect extends withUploadSourceSelectFx.Select = withUploadSourceSelectFx.Select,
	> {
		select: TSelect;
		where?: UploadFilterSchema.Type;
	}

	export type Callback = <TSelect extends withUploadSourceSelectFx.Select>(
		props: Props<TSelect>,
	) => TSelect;
}

export const withUploadQueryBuilderFx = Effect.fn("withUploadQueryBuilderFx")(function* <
	TSelect extends withUploadSourceSelectFx.Select,
>({ select, where }: withUploadQueryBuilderFx.Props<TSelect>) {
	let query = select;

	if (!where) {
		return yield* Effect.succeed(select);
	}

	if (where.id) {
		query = query.where("u.id", "=", where.id) as TSelect;
	}

	if (where.idIn && where.idIn.length > 0) {
		query = query.where("u.id", "in", where.idIn) as TSelect;
	}

	return yield* Effect.succeed(query);
});
