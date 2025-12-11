import type { MessageGalleryFilterSchema } from "~/@user/message-gallery/schema/MessageGalleryFilterSchema";
import type { withMessageGallerySelect } from "./withMessageGallerySelect";

export namespace withMessageGalleryQueryBuilder {
	export interface Props {
		select: withMessageGallerySelect.Select;
		where?: MessageGalleryFilterSchema.Type;
	}

	export type Callback = (props: Props) => withMessageGallerySelect.Select;
}

export const withMessageGalleryQueryBuilder: withMessageGalleryQueryBuilder.Callback = ({
	select,
	where,
}) => {
	if (!where) {
		return select;
	}

	let query = select;

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

	return query;
};
