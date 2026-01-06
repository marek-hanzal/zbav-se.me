import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { galleryFetchFx } from "~/@user/gallery/fx/galleryFetchFx";
import type { GalleryCreateSchema } from "~/app/gallery/schema/GalleryCreateSchema";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";

export namespace galleryCreateFx {
	export type Props = GalleryCreateSchema.Type;
}

export const galleryCreateFx = Effect.fn("galleryCreateFx")(function* ({
	userId,
	...props
}: galleryCreateFx.Props) {
	const database = yield* DatabaseContextFx;

	const id = genId();

	yield* Effect.promise(async () => {
		return database
			.insertInto("gallery")
			.values({
				...props,
				id,
				userId,
				createdAt: new Date(),
			})
			.execute();
	});

	return yield* galleryFetchFx({
		where: {
			id,
		},
		scope: {
			userId,
		},
	});
});

export type galleryCreateFx = ReturnType<typeof galleryCreateFx>;
