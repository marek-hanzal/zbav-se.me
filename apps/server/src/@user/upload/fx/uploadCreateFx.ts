import { DateContextFx } from "@use-pico/common/date";
import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { UploadContextFx } from "~/@common/upload/context/UploadContextFx";
import { uploadFetchFx } from "~/@user/upload/fx/uploadFetchFx";
import type { UploadCreateSchema } from "~/@user/upload/schema/UploadCreateSchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { withTraceFx } from "~/effect/withTraceFx";
import { InvalidRequestErrorFx } from "~/error/InvalidRequestErrorFx";

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
	yield* withTraceFx({
		fx: "uploadCreateFx",
		input: {
			userId,
			url,
			...data,
		},
	});

	const { kysely } = yield* KyselyContextFx;
	const uploadContext = yield* UploadContextFx;
	const dateContext = yield* DateContextFx;

	if (!url.startsWith(uploadContext.cdn)) {
		yield* withTraceFx({
			fx: "uploadCreateFx",
			error: {
				message: "Only content from the CDN can be uploaded",
			},
		});
		return yield* new InvalidRequestErrorFx({
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
