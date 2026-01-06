import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withMessageGalleryQueryBuilder } from "~/app/message-gallery/db/withMessageGalleryQueryBuilder";
import { withMessageGallerySelect } from "~/app/message-gallery/db/withMessageGallerySelect";
import type { MessageGalleryQuerySchema } from "~/app/message-gallery/schema/MessageGalleryQuerySchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { MessageGallerySchema } from "../schema/MessageGallerySchema";

export namespace messageGalleryFetchFx {
	export type Props = MessageGalleryQuerySchema.Type;
}

export const messageGalleryFetchFx = Effect.fn("messageGalleryFetchFx")(function* ({
	filter,
	where,
	sort,
}: messageGalleryFetchFx.Props) {
	const database = yield* DatabaseContextFx;
	const user = yield* UserContextFx;

	return yield* withFetchFx({
		resource: "message-gallery",
		select: withMessageGallerySelect({
			database,
			sort,
			userId: user.id,
		}),
		output: MessageGallerySchema,
		filter,
		where,
		query: withMessageGalleryQueryBuilder,
	});
});

export type messageGalleryFetchFx = ReturnType<typeof messageGalleryFetchFx>;
