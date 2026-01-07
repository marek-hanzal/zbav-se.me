import { genId } from "@use-pico/common/gen-id";
import type { AssertNever } from "@use-pico/common/type";
import { Effect } from "effect";
import { galleryFetchFx } from "~/app/gallery/fx/galleryFetchFx";
import type { GalleryCreateSchema } from "~/app/gallery/schema/GalleryCreateSchema";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";

export namespace galleryCreateFx {
	export interface Props extends GalleryCreateSchema.Type {
		userId: string;
		id?: string;
	}
}

export const galleryCreateFx = Effect.fn("galleryCreateFx")(function* ({
	userId,
	id,
	...props
}: galleryCreateFx.Props) {
	const database = yield* DatabaseContextFx;

	const galleryId = id ?? genId();

	yield* Effect.promise(async () => {
		return database
			.insertInto("gallery")
			.values({
				...props,
				id: galleryId,
				userId,
				createdAt: new Date(),
			})
			.onConflict((eb) => {
				return eb.doNothing();
			})
			.execute();
	});

	return yield* galleryFetchFx({
		where: {
			id: galleryId,
		},
		scope: {
			userId,
		},
	});
});

export type galleryCreateFx = ReturnType<typeof galleryCreateFx>;

