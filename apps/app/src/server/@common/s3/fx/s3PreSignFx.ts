import { genId } from "@use-pico/common/gen-id";
import { keyOf } from "@use-pico/common/key-of";
import { linkTo } from "@use-pico/common/link-to";
import { Effect } from "effect";
import { UploadContextFx } from "~/client/@user/upload/server/context/UploadContextFx";
import { S3ContextFx } from "~/server/@common/s3/context/S3ContextFx";
import { s3ClientFx } from "~/server/@common/s3/fx/s3ClientFx";

export namespace s3PreSignFx {
	export interface Props {
		userId: string;
		path: string;
		extension: string;
	}
}

export const s3PreSignFx = Effect.fn("s3PreSignFx")(function* ({
	userId,
	path,
	extension,
}: s3PreSignFx.Props) {
	const { cdn } = yield* UploadContextFx;
	const { bucket } = yield* S3ContextFx;

	const s3 = yield* s3ClientFx();

	const key = `${keyOf(userId)}/${path}/${genId()}.${extension}`;

	const url = yield* Effect.promise(async () => {
		return s3.presignedPutObject(bucket, key, 60 * 30);
	});

	return {
		url,
		cdn: linkTo({
			base: cdn,
			href: `/${key}`,
		}),
	} as const;
});

export type s3PreSignFx = ReturnType<typeof s3PreSignFx>;
