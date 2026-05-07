import { Effect } from "effect";
import { genId } from "@/lib/common/gen-id";
import { keyOf } from "@/lib/common/key-of";
import { linkTo } from "@/lib/common/link-to";
import { getLoggerFx } from "@/lib/common/log";
import { S3ContextFx } from "~/common/s3/server/context/S3ContextFx";
import { s3ClientFx } from "~/common/s3/server/fx/s3ClientFx";
import { UploadContextFx } from "~/user/upload/server/context/UploadContextFx";

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
	const logger = yield* getLoggerFx("s3PreSignFx");
	logger.trace("s3PreSignFx", {
		userId,
		path,
		extension,
	});

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
