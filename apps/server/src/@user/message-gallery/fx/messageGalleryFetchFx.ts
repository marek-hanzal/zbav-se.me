import { withFetchFx } from "@use-pico/common/fetch";
import type { AssertNever } from "@use-pico/common/type";
import { Effect } from "effect";
import { withMessageGallerySelectFx } from "~/@user/message-gallery/db/withMessageGallerySelectFx";
import { withMessageGalleryQueryBuilderFx } from "~/app/message-gallery/db/withMessageGalleryQueryBuilderFx";
import type { MessageGalleryFilterSchema } from "~/app/message-gallery/schema/MessageGalleryFilterSchema";
import type { MessageGalleryQuerySchema } from "~/app/message-gallery/schema/MessageGalleryQuerySchema";
import type { UserContextFx } from "~/auth/fx/UserContextFx";

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

type _NoUser = AssertNever<Extract<Effect.Effect.Context<messageGalleryFetchFx>, UserContextFx>>;
