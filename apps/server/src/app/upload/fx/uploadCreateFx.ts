import { DateContextFx } from "@use-pico/common/date";
import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { UploadContextFx } from "~/app/upload/context/UploadContextFx";
import { uploadFetchFx } from "~/app/upload/fx/uploadFetchFx";
import type { UploadCreateSchema } from "~/app/upload/schema/UploadCreateSchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { InvalidRequestError } from "~/error/InvalidRequestError";

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
		return yield* new InvalidRequestError({
			message: "Only content from the CDN can be uploaded",
		});
	}

	const id = genId();
	const now = dateContext.now();

	yield* Effect.promise(async () => {
		return kysely
			.insertInto("upload")
			.values({
				...data,
				id,
				userId,
				url,
				createdAt: now.toJSDate(),
			})
			.execute();
	});

	return yield* uploadFetchFx({
		where: {
			id,
		},
		scope: {},
	});
});

export type uploadCreateFx = ReturnType<typeof uploadCreateFx>;
