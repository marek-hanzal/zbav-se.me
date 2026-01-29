import { DateContextFx } from "@use-pico/common/date";
import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { galleryFetchFx } from "~/@user/gallery/fx/galleryFetchFx";
import type { GalleryCreateSchema } from "~/@user/gallery/schema/GalleryCreateSchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";

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
	const { kysely } = yield* KyselyContextFx;
	const dateContext = yield* DateContextFx;

	const galleryId = id ?? genId();

	yield* Effect.promise(async () => {
		return kysely
			.insertInto("gallery")
			.values({
				...props,
				id: galleryId,
				userId,
				createdAt: dateContext.now().toJSDate(),
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
