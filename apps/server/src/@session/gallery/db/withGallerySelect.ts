import { jsonObjectFrom } from "kysely/helpers/postgres";
import { match } from "ts-pattern";
import { database } from "../../../database/kysely";
import { withUploadSelect } from "../../upload/db/withUploadSelect";
import type { GallerySortSchema } from "../schema/GallerySortSchema";

export namespace withGallerySelect {
	export interface Props {
		sort?: GallerySortSchema.Type[];
	}
	export type Select = ReturnType<typeof withGallerySelect>;
}

export const withGallerySelect = ({ sort }: withGallerySelect.Props = {}) => {
	let query = database.kysely.selectFrom("gallery as g").select([
		"g.id",
		"g.listingId",
		"g.uploadId",
		"g.sort",
		(eb) => jsonObjectFrom(withUploadSelect().whereRef("u.id", "=", eb.ref("g.uploadId")).limit(1)).as("upload"),
	]);

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("sort", () => query.orderBy("g.sort", item.direction))
			.with("createdAt", () => query.orderBy("g.createdAt", item.direction))
			.exhaustive();
	}

	return query;
};
