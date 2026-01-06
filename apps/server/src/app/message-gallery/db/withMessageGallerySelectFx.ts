import { Effect } from "effect";
import { sql } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import { match } from "ts-pattern";
import { withGallerySelectFx } from "~/app/gallery/db/withGallerySelectFx";
import type { MessageDirectionEnumSchema } from "~/app/message/schema/MessageDirectionEnumSchema";
import type { MessageGallerySortSchema } from "~/app/message-gallery/schema/MessageGallerySortSchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";

export namespace withMessageGallerySelectFx {
	export interface Props {
		sort?: MessageGallerySortSchema.Type[];
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withMessageGallerySelectFx>>;
}

export const withMessageGallerySelectFx = Effect.fn("withMessageGallerySelectFx")(function* ({
	sort,
}: withMessageGallerySelectFx.Props) {
	const database = yield* DatabaseContextFx;
	const user = yield* UserContextFx;

	const gallerySelect = yield* withGallerySelectFx({});

	let query = database
		.selectFrom("message_gallery as mg")
		.selectAll()
		.select(sql<"gallery">`'gallery'`.as("type"))
		.select((eb) =>
			eb
				.case()
				.when("mg.userId", "=", user.id)
				.then<MessageDirectionEnumSchema.Type>("out")
				.else<MessageDirectionEnumSchema.Type>("in")
				.end()
				.as("direction"),
		)
		.select((eb) => [
			jsonObjectFrom(gallerySelect.where("gal.id", "=", eb.ref("mg.galleryId")).limit(1))
				.$notNull()
				.as("gallery"),
		]);

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("mg.createdAt", item.direction))
			.exhaustive();
	}

	return query;
});
