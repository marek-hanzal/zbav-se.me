import { withMessageGallerySelect as withMessageGallerySelectApp } from "~/app/message-gallery/db/withMessageGallerySelect";
import type { MessageGallerySortSchema } from "~/app/message-gallery/schema/MessageGallerySortSchema";
import type { WithDatabase } from "~/database/WithDatabase";

export namespace withMessageGallerySelect {
	export interface Props {
		database: WithDatabase;
		sort: MessageGallerySortSchema.Type[] | undefined;
	}

	export type Select = ReturnType<typeof withMessageGallerySelect>;
}

export const withMessageGallerySelect = ({ database, sort }: withMessageGallerySelect.Props) => {
	return withMessageGallerySelectApp({
		database,
		sort,
	});
};
