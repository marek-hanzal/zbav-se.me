import { DateContextFx } from "@use-pico/common/date";
import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { UploadContextFx } from "~/server/@user/upload/context/UploadContextFx";
import type { UploadCreateSchema } from "~/server/@user/upload/schema/UploadCreateSchema";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
import { InvalidRequestErrorFx } from "~/server/error/InvalidRequestErrorFx";

export namespace uploadCreateFx {
	export interface Props extends UploadCreateSchema.Type {
		userId: string;
	}
}

export const uploadCreateFx = Effect.fn("uploadCreateFx")(function* ({
	userId,
	url,
	...data
}: uploadCreateFx.Props) {
	const { kysely } = yield* KyselyContextFx;
	const uploadContext = yield* UploadContextFx;
	const dateContext = yield* DateContextFx;

	if (!url.startsWith(uploadContext.cdn)) {
		return yield* new InvalidRequestErrorFx({
			message: "Only content from the CDN can be uploaded",
		});
	}

	const id = genId();
	const now = dateContext.now();

	yield* tryDbFx(async () =>
		kysely
			.insertInto("upload")
			.values({
				...data,
				id,
				userId,
				url,
				createdAt: now.toJSDate(),
			})
			.execute(),
	);

	return {
		id,
		url,
	};
});

export type uploadCreateFx = ReturnType<typeof uploadCreateFx>;
