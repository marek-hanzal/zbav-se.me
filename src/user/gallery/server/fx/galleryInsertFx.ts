import { Effect } from "effect";
import { DateContextFx } from "@/lib/common/date";
import { genId } from "@/lib/common/gen-id";
import { getLoggerFx } from "@/lib/common/log";
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
	id = genId(),
	...props
}: galleryInsertFx.Props) {
	const logger = yield* getLoggerFx("galleryInsertFx");
	logger.trace("galleryInsertFx", {
		userId,
		...props,
	});

	const { kysely } = yield* KyselyContextFx;
	const dateContext = yield* DateContextFx;

	yield* tryDbFx(async () => {
		return kysely
			.insertInto("gallery")
			.values({
				...props,
				id,
				userId,
				createdAt: dateContext.now().toJSDate(),
			})
			.execute();
	});

	return {
		id,
	} as const;
});

export type galleryInsertFx = ReturnType<typeof galleryInsertFx>;
