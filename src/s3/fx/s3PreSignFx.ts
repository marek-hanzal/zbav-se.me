import { Effect } from "effect";
import { keyOf } from "~/hash/fn/keyOf";
import { genId } from "~/identity/fn/genId";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import { rateLimitCheckFx } from "~/rate-limit/fx/rateLimitCheckFx";
import { s3ConfigFx } from "~/s3/context/s3ConfigFx";
import { s3ClientFx } from "~/s3/fx/s3ClientFx";
import { linkTo } from "~/url/fn/linkTo";
import { UploadConfigFx } from "~/user-upload/context/UploadConfigFx";

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

	yield* rateLimitCheckFx({
		key: [
			userId,
		],
		rule: "s3:presign",
		message: "You've reached rate limit for uploaded images.",
	});

	const { cdn } = yield* UploadConfigFx;
	const { bucket } = yield* s3ConfigFx;

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
