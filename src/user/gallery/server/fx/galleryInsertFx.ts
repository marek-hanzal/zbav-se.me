import { Effect } from "effect";
import { DateContextFx } from "@/lib/common/date";
import { genId } from "@/lib/common/gen-id";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
import type { GalleryCreateSchema } from "~/user/gallery/server/schema/GalleryCreateSchema";

export namespace galleryInsertFx {
	export interface Props extends GalleryCreateSchema.Type {
		userId: string;
		id?: string;
	}
}

export const galleryInsertFx = Effect.fn("galleryInsertFx")(function* ({
	userId,
	id,
	...props
}: galleryInsertFx.Props) {
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

	return {
		id: galleryId,
	} as const;
});

export type galleryInsertFx = ReturnType<typeof galleryInsertFx>;
