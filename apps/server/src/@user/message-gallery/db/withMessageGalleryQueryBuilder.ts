import { withMessageGalleryQueryBuilder as withMessageGalleryQueryBuilderApp } from "~/app/message-gallery/db/withMessageGalleryQueryBuilder";
import type { MessageGalleryFilterSchema } from "~/app/message-gallery/schema/MessageGalleryFilterSchema";
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
	return withMessageGalleryQueryBuilderApp({
		select,
		where,
	});
};
