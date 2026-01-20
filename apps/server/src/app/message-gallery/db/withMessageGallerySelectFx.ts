import { Effect } from "effect";
import { sql } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import { match } from "ts-pattern";
import { withGallerySelectFx } from "~/app/gallery/db/withGallerySelectFx";
import type { MessageDirectionEnumSchema } from "~/app/message/schema/MessageDirectionEnumSchema";
import type { MessageGallerySortSchema } from "~/app/message-gallery/schema/MessageGallerySortSchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";

export namespace withMessageGallerySelectFx {
	export interface Props {
		userId: string;
		sort?: MessageGallerySortSchema.Type[];
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withMessageGallerySelectFx>>;
}

export const withMessageGallerySelectFx = Effect.fn("withMessageGallerySelectFx")(function* ({
	userId,
	sort,
}: withMessageGallerySelectFx.Props) {
	const { kysely } = yield* KyselyContextFx;

	const gallerySelect = yield* withGallerySelectFx({});

	let query = kysely
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
