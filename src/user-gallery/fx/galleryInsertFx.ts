import { Effect } from "effect";
import { dbFx } from "~/database/fx/dbFx";
import { DateServiceFx } from "~/date/service/DateServiceFx";
import { genId } from "~/identity/fn/genId";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import type { GalleryCreateSchema } from "~/user-gallery/schema/GalleryCreateSchema";

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
