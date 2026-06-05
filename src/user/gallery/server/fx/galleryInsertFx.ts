import { Effect } from "effect";
import { DateServiceFx } from "@/lib/common/date";
import { genId } from "@/lib/common/gen-id";
import { getLoggerFx } from "@/lib/common/log";
import { dbFx } from "~/server/database/fx/dbFx";
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

	const dateService = yield* DateServiceFx;

	yield* dbFx(async (kysely) => {
		return kysely
			.insertInto("gallery")
			.values({
				...props,
				id,
				userId,
				createdAt: dateService.now().toJSDate(),
			})
			.execute();
	});

	return {
		id,
	} as const;
});

export type galleryInsertFx = ReturnType<typeof galleryInsertFx>;
