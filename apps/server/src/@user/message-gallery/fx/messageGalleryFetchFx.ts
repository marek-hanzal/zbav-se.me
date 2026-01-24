import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withMessageGalleryQueryBuilderFx } from "~/@user/message-gallery/db/withMessageGalleryQueryBuilderFx";
import { withMessageGallerySelectFx } from "~/@user/message-gallery/db/withMessageGallerySelectFx";
import type { MessageGalleryFilterSchema } from "~/@user/message-gallery/schema/MessageGalleryFilterSchema";
import type { MessageGalleryQuerySchema } from "~/@user/message-gallery/schema/MessageGalleryQuerySchema";

export namespace messageGalleryFetchFx {
	export interface Props extends MessageGalleryQuerySchema.Type {
		userId: string;
		scope: MessageGalleryFilterSchema.Type;
	}
}

export const messageGalleryFetchFx = Effect.fn("messageGalleryFetchFx")(function* ({
	userId,
	filter,
	where,
	scope,
	sort,
}: messageGalleryFetchFx.Props) {
	return yield* withFetchFx({
		resource: "message-gallery",
		selectFx: withMessageGallerySelectFx({
			userId,
			sort,
		}),
		filter,
		where,
		scope,
		queryFx: withMessageGalleryQueryBuilderFx,
	});
});

export type messageGalleryFetchFx = ReturnType<typeof messageGalleryFetchFx>;
