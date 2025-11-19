import { genId } from "@use-pico/common/gen-id";
import { keyOf } from "@use-pico/common/key-of";
import { linkTo } from "@use-pico/common/link-to";
import { Effect } from "effect";
import { AppEnv } from "../../../AppEnv";
import { UserContextFx } from "../../../auth/UserContextFx";
import { s3 } from "../../../s3";

export namespace s3PreSignFx {
	export interface Props {
		path: string;
		extension: string;
	}
}

export const s3PreSignFx = ({ path, extension }: s3PreSignFx.Props) => {
	return Effect.gen(function* () {
		const user = yield* UserContextFx;

		const key = `${keyOf(user.id)}/${path}/${genId()}.${extension}`;

		const url = yield* Effect.tryPromise(async () => {
			return s3.presignedPutObject(AppEnv.SERVER_S3_BUCKET, key, 60 * 30);
		});

		return {
			url,
			cdn: linkTo({
				base: AppEnv.SERVER_CONTENT_CDN,
				href: `/${key}`,
			}),
		};
	});
};

export type s3PreSignFx = ReturnType<typeof s3PreSignFx>;
