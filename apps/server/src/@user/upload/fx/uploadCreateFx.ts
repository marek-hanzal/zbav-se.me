import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { AppEnv } from "~/AppEnv";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { InvalidRequestError } from "~/error/InvalidRequestError";
import type { UploadCreateSchema } from "../schema/UploadCreateSchema";
import { uploadFetchFx } from "./uploadFetchFx";

export namespace uploadCreateFx {
	export type Props = UploadCreateSchema.Type;
}

export const uploadCreateFx = ({ url }: uploadCreateFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;

		if (!url.startsWith(AppEnv.SERVER_CONTENT_CDN)) {
			return yield* new InvalidRequestError({
				message: "Only content from the CDN can be uploaded",
			});
		}

		const id = genId();
		const now = new Date();

		yield* Effect.tryPromise(async () => {
			return database
				.insertInto("upload")
				.values({
					id,
					userId: user.id,
					url,
					createdAt: now,
				})
				.execute();
		});

		return yield* uploadFetchFx({
			where: {
				id,
			},
		});
	});
};

export type uploadCreateFx = ReturnType<typeof uploadCreateFx>;
