import { withCollectionFx } from "@use-pico/common/collection";
import type { AssertNever } from "@use-pico/common/type";
import { Effect } from "effect";
import { withGalleryItemQueryBuilderFx } from "~/app/gallery-item/db/withGalleryItemQueryBuilderFx";
import { withGalleryItemSelectFx } from "~/app/gallery-item/db/withGalleryItemSelectFx";
import type { GalleryItemFilterSchema } from "~/app/gallery-item/schema/GalleryItemFilterSchema";
import type { GalleryItemQuerySchema } from "~/app/gallery-item/schema/GalleryItemQuerySchema";
import type { UserContextFx } from "~/auth/fx/UserContextFx";

export namespace galleryItemCollectionFx {
	export interface Props extends GalleryItemQuerySchema.Type {
		scope: GalleryItemFilterSchema.Type;
	}
}

export const galleryItemCollectionFx = Effect.fn("galleryItemCollectionFx")(function* ({
	cursor,
	filter,
	where,
	scope,
	sort,
}: galleryItemCollectionFx.Props) {
	return yield* withCollectionFx({
		selectFx: withGalleryItemSelectFx({
			sort,
		}),
		cursor: cursor ?? {
			page: 0,
			size: 10,
		},
		filter,
		where,
		scope,
		queryFx: withGalleryItemQueryBuilderFx,
	});
});

export type galleryItemCollectionFx = ReturnType<typeof galleryItemCollectionFx>;

type _NoUser = AssertNever<Extract<Effect.Effect.Context<galleryItemCollectionFx>, UserContextFx>>;
