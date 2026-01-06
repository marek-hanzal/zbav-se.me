import { genId } from "@use-pico/common/gen-id";
import type { AssertNever } from "@use-pico/common/type";
import { Effect } from "effect";
import { DateTime } from "luxon";
import { galleryFetchFx } from "~/@user/gallery/fx/galleryFetchFx";
import type { GalleryItemCreateSchema } from "~/@user/gallery-item/schema/GalleryItemCreateSchema";
import { galleryItemFetchFx } from "~/app/gallery-item/fx/galleryItemFetchFx";
import type { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";

export namespace galleryItemCreateFx {
	export interface Props extends GalleryItemCreateSchema.Type {
		userId: string;
		createdAt?: DateTime;
	}
}

export const galleryItemCreateFx = Effect.fn("galleryItemCreateFx")(function* ({
	userId,
	galleryId,
	createdAt,
	...data
}: galleryItemCreateFx.Props) {
	const database = yield* DatabaseContextFx;

	const now = createdAt ?? DateTime.now();
	const id = genId();

	/**
	 * Just ensures the gallery exists with the correct user
	 */
	yield* galleryFetchFx({
		where: {
			id: galleryId,
		},
		scope: {
			userId,
		},
	});

	yield* Effect.promise(async () => {
		return database
			.insertInto("gallery_item")
			.values({
				...data,
				id,
				galleryId,
				createdAt: now.toJSDate(),
			})
			.execute();
	});

	return yield* galleryItemFetchFx({
		where: {
			id,
		},
		scope: {},
	});
});

export type galleryItemCreateFx = ReturnType<typeof galleryItemCreateFx>;

type _NoUser = AssertNever<Extract<Effect.Effect.Context<galleryItemCreateFx>, UserContextFx>>;
