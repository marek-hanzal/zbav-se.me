import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withMessageGallerySelectFx } from "~/@user/message-gallery/db/withMessageGallerySelectFx";
import { MessageGallerySchema } from "~/@user/message-gallery/schema/MessageGallerySchema";
import { withMessageGalleryQueryBuilder } from "~/app/message-gallery/db/withMessageGalleryQueryBuilder";
import type { MessageGalleryQuerySchema } from "~/app/message-gallery/schema/MessageGalleryQuerySchema";

export namespace messageGalleryFetchFx {
	export type Props = MessageGalleryQuerySchema.Type;
}

export const messageGalleryFetchFx = Effect.fn("messageGalleryFetchFx")(function* ({
	filter,
	where,
	sort,
}: messageGalleryFetchFx.Props) {
	return yield* withFetchFx({
		resource: "message-gallery",
		select: yield* withMessageGallerySelectFx({
			sort,
		}),
		output: MessageGallerySchema,
		filter,
		where,
		query: withMessageGalleryQueryBuilder,
	});
});

export type messageGalleryFetchFx = ReturnType<typeof messageGalleryFetchFx>;
