import { Effect } from "effect";
import type { withGallerySourceSelectFx } from "~/public/gallery/server/db/withGallerySourceSelectFx";
import type { GalleryFilterSchema } from "~/public/gallery/server/schema/GalleryFilterSchema";

export namespace withGalleryQueryBuilderFx {
	export interface Props<
		TSelect extends withGallerySourceSelectFx.Select = withGallerySourceSelectFx.Select,
	> {
		select: TSelect;
		where?: GalleryFilterSchema.Type;
	}

	export type Callback = <TSelect extends withGallerySourceSelectFx.Select>(
		props: Props<TSelect>,
	) => TSelect;
}

export const withGalleryQueryBuilderFx = Effect.fn("withGalleryQueryBuilderFx")(function* <
	TSelect extends withGallerySourceSelectFx.Select,
>({ select, where }: withGalleryQueryBuilderFx.Props<TSelect>) {
	let query = select;

	if (!where) {
		return yield* Effect.succeed(select);
	}

	if (where.id) {
		query = query.where("gal.id", "=", where.id) as TSelect;
	}

	if (where.idIn && where.idIn.length > 0) {
		query = query.where("gal.id", "in", where.idIn) as TSelect;
	}

	return yield* Effect.succeed(query);
});
