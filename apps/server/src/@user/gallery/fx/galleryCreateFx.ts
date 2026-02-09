import { DateContextFx } from "@use-pico/common/date";
import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { galleryFetchFx } from "~/@user/gallery/fx/galleryFetchFx";
import type { GalleryCreateSchema } from "~/@user/gallery/schema/GalleryCreateSchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { tryDbFx } from "~/database/fx/tryDbFx";
import { withTraceFx } from "~/effect/withTraceFx";

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
	yield* withTraceFx({
		fx: "galleryCreateFx",
		input: {
			userId,
			id,
			...props,
		},
	});

	const { kysely } = yield* KyselyContextFx;
	const dateContext = yield* DateContextFx;

	const galleryId = id ?? genId();

	yield* tryDbFx(async () =>
		kysely
			.insertInto("gallery")
			.values({
				...props,
				id: galleryId,
				userId,
				createdAt: dateContext.now().toJSDate(),
			})
			.onConflict((eb) => eb.doNothing())
			.execute(),
	);

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
