import { withCountFx } from "@use-pico/common/count";
import type { AssertNever } from "@use-pico/common/type";
import { Effect } from "effect";
import { withGalleryQueryBuilderFx } from "~/app/gallery/db/withGalleryQueryBuilderFx";
import { withGallerySelectFx } from "~/app/gallery/db/withGallerySelectFx";
import type { GalleryCountQuerySchema } from "~/app/gallery/schema/GalleryCountQuerySchema";
import type { GalleryFilterSchema } from "~/app/gallery/schema/GalleryFilterSchema";
import type { UserContextFx } from "~/auth/fx/UserContextFx";

export namespace galleryCountFx {
	export interface Props extends GalleryCountQuerySchema.Type {
		scope: GalleryFilterSchema.Type;
	}
}

export const galleryCountFx = Effect.fn("galleryCountFx")(function* ({
	filter,
	where,
	scope,
}: galleryCountFx.Props) {
	return yield* withCountFx({
		selectFx: withGallerySelectFx({}),
		filter,
		where,
		scope,
		queryFx: withGalleryQueryBuilderFx,
	});
});

export type galleryCountFx = ReturnType<typeof galleryCountFx>;

type _NoUser = AssertNever<Extract<Effect.Effect.Context<galleryCountFx>, UserContextFx>>;
