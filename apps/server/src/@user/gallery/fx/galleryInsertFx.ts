import { DateContextFx } from "@use-pico/common/date";
import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import type { galleryCreateFx } from "~/@user/gallery/fx/galleryCreateFx";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { tryDbFx } from "~/database/fx/tryDbFx";
import { withTraceFx } from "~/effect/withTraceFx";

export const galleryInsertFx = Effect.fn("galleryInsertFx")(function* ({
	userId,
	id,
	...props
}: galleryCreateFx.Props) {
	yield* withTraceFx({
		fx: "galleryInsertFx",
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

	return {
		id: galleryId,
	};
});

export type galleryInsertFx = ReturnType<typeof galleryInsertFx>;

