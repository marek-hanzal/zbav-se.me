import { Effect } from "effect";
import type { withMessageGallerySelectFx } from "~/@user/message-gallery/db/withMessageGallerySelectFx";
import type { MessageGalleryFilterSchema } from "~/@user/message-gallery/schema/MessageGalleryFilterSchema";

export namespace withMessageGalleryQueryBuilderFx {
	export interface Props {
		select: withMessageGallerySelectFx.Select;
		where?: MessageGalleryFilterSchema.Type;
	}

	export type Callback = (props: Props) => withMessageGallerySelectFx.Select;
}

export const withMessageGalleryQueryBuilderFx = Effect.fn("withMessageGalleryQueryBuilderFx")(
	function* ({ select, where }: withMessageGalleryQueryBuilderFx.Props) {
		let query = select;

		if (!where) {
			return yield* Effect.succeed(select);
		}

		if (where.id) {
			query = query.where("mg.id", "=", where.id);
		}

		if (where.idIn && where.idIn.length > 0) {
			query = query.where("mg.id", "in", where.idIn);
		}

		if (where.messageThreadId) {
			query = query.where("mg.messageThreadId", "=", where.messageThreadId);
		}

		if (where.userId) {
			query = query.where("mg.userId", "=", where.userId);
		}

		if (where.galleryId) {
			query = query.where("mg.galleryId", "=", where.galleryId);
		}

		return yield* Effect.succeed(query);
	},
);
