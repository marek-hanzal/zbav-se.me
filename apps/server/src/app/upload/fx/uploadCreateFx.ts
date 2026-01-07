import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { UploadContextFx } from "~/app/upload/context/UploadContextFx";
import { uploadFetchFx } from "~/app/upload/fx/uploadFetchFx";
import type { UploadCreateSchema } from "~/app/upload/schema/UploadCreateSchema";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
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
	const database = yield* DatabaseContextFx;
	const uploadContext = yield* UploadContextFx;

	if (!url.startsWith(uploadContext.cdn)) {
		return yield* new InvalidRequestError({
			message: "Only content from the CDN can be uploaded",
		});
	}

	const id = genId();
	const now = new Date();

	yield* Effect.promise(async () => {
		return database
			.insertInto("upload")
			.values({
				...data,
				id,
				userId,
				url,
				createdAt: now,
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
