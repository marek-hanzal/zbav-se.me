import { withFetchFx } from "@use-pico/common/fetch";
import type { AssertNever } from "@use-pico/common/type";
import { Effect } from "effect";
import { withGalleryItemQueryBuilderFx } from "~/app/gallery-item/db/withGalleryItemQueryBuilderFx";
import { withGalleryItemSelectFx } from "~/app/gallery-item/db/withGalleryItemSelectFx";
import type { GalleryItemFilterSchema } from "~/app/gallery-item/schema/GalleryItemFilterSchema";
import type { GalleryItemQuerySchema } from "~/app/gallery-item/schema/GalleryItemQuerySchema";
import type { UserContextFx } from "~/auth/fx/UserContextFx";

export namespace galleryItemFetchFx {
	export interface Props extends GalleryItemQuerySchema.Type {
		scope: GalleryItemFilterSchema.Type;
	}
}

export const galleryItemFetchFx = Effect.fn("galleryItemFetchFx")(function* ({
	filter,
	where,
	scope,
	sort,
}: galleryItemFetchFx.Props) {
	return yield* withFetchFx({
		resource: "gallery-item",
		selectFx: withGalleryItemSelectFx({
			sort,
		}),
		filter,
		where,
		scope,
		queryFx: withGalleryItemQueryBuilderFx,
	});
});

export type galleryItemFetchFx = ReturnType<typeof galleryItemFetchFx>;

type _NoUser = AssertNever<Extract<Effect.Effect.Context<galleryItemFetchFx>, UserContextFx>>;
