import { Effect } from "effect";
import { match } from "ts-pattern";
import type { GallerySortSchema } from "~/public/gallery/server/schema/GallerySortSchema";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";

export namespace withGallerySourceSelectFx {
	export interface Props {
		sort?: GallerySortSchema.Type[];
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withGallerySourceSelectFx>>;
}

export const withGallerySourceSelectFx = Effect.fn("withGallerySourceSelectFx")(function* ({
	sort,
}: withGallerySourceSelectFx.Props) {
	const { kysely } = yield* KyselyContextFx;

	let query = kysely.selectFrom("gallery as gal");

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("gal.createdAt", item.order))
			.exhaustive();
	}

	return query;
});
