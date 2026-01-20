import { Effect } from "effect";
import type { GalleryFilterSchema } from "~/app/gallery/schema/GalleryFilterSchema";
import type { withGallerySelectFx } from "./withGallerySelectFx";

export namespace withGalleryQueryBuilderFx {
	export interface Props {
		select: withGallerySelectFx.Select;
		where?: GalleryFilterSchema.Type;
	}

	export type Callback = (props: Props) => withGallerySelectFx.Select;
}

export const withGalleryQueryBuilderFx = Effect.fn("withGalleryQueryBuilderFx")(function* ({
	select,
	where,
}: withGalleryQueryBuilderFx.Props) {
	let query = select;

	if (!where) {
		return yield* Effect.succeed(select);
	}

	if (where.id) {
		query = query.where("gal.id", "=", where.id);
	}

	if (where.idIn && where.idIn.length > 0) {
		query = query.where("gal.id", "in", where.idIn);
	}

	if (where.userId) {
		query = query.where("gal.userId", "=", where.userId);
	}

	return yield* Effect.succeed(query);
});
