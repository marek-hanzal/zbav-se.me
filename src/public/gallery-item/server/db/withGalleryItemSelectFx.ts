import { Effect } from "effect";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import { match } from "ts-pattern";
import { selectFx } from "@/lib/common/select";
import { withUploadSelectFx } from "~/public/upload/server/db/withUploadSelectFx";
import type { UploadSchema } from "~/public/upload/server/schema/UploadSchema";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import type { GalleryItemSortSchema } from "../schema/GalleryItemSortSchema";

export namespace withGalleryItemSelectFx {
	export interface Props {
		sort?: GalleryItemSortSchema.Type[];
	}
}

export const withGalleryItemSelectFx = Effect.fn("withGalleryItemSelectFx")(function* ({
	sort,
}: withGalleryItemSelectFx.Props) {
	const { kysely } = yield* KyselyContextFx;

	let select = kysely.selectFrom("gallery_item as gal_item");

	for (const item of sort ?? []) {
		select = match(item.field)
			.with("sort", () => select.orderBy("gal_item.sort", item.order))
			.with("createdAt", () => select.orderBy("gal_item.createdAt", item.order))
			.exhaustive();
	}

	const { select: uploadSql } = yield* withUploadSelectFx({});

	return selectFx({
		select: select.select([
			"gal_item.id",
			"gal_item.galleryId",
			"gal_item.uploadId",
			"gal_item.sort",
			"gal_item.createdAt",
			(eb) => {
				return jsonObjectFrom(
					uploadSql.whereRef("u.id", "=", eb.ref("gal_item.uploadId")).limit(1),
				)
					.$notNull()
					.$castTo<UploadSchema.Type>()
					.as("upload");
			},
		]),
		queryFx(select) {
			return Effect.succeed(select);
		},
	});
});
