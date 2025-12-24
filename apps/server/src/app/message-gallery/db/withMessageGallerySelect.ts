import { sql } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import { match } from "ts-pattern";
import { withGallerySelect } from "~/app/gallery/db/withGallerySelect";
import type { MessageDirectionEnumSchema } from "~/app/message/schema/MessageDirectionEnumSchema";
import type { MessageGallerySortSchema } from "~/app/message-gallery/schema/MessageGallerySortSchema";
import type { WithDatabase } from "~/database/WithDatabase";

export namespace withMessageGallerySelect {
	export interface Props {
		database: WithDatabase;
		sort: MessageGallerySortSchema.Type[] | undefined;
		userId: string;
	}

	export type Select = ReturnType<typeof withMessageGallerySelect>;
}

export const withMessageGallerySelect = ({
	database,
	sort,
	userId,
}: withMessageGallerySelect.Props) => {
	let query = database
		.selectFrom("message_gallery as mg")
		.selectAll()
		.select(sql<"gallery">`'gallery'`.as("type"))
		.select((eb) =>
			eb
				.case()
				.when("mg.userId", "=", userId)
				.then<MessageDirectionEnumSchema.Type>("out")
				.else<MessageDirectionEnumSchema.Type>("in")
				.end()
				.as("direction"),
		)
		.select((eb) => [
			jsonObjectFrom(
				withGallerySelect({
					database,
					sort: undefined,
				})
					.where("gal.id", "=", eb.ref("mg.galleryId"))
					.limit(1),
			)
				.$notNull()
				.as("gallery"),
		]);

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("mg.createdAt", item.direction))
			.exhaustive();
	}

	return query;
};
