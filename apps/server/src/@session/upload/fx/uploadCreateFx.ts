import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { AppEnv } from "../../../AppEnv";
import { InvalidRequestError } from "../../../error/InvalidRequestError";
import { DatabaseContextFx } from "../../../fx/DatabaseContextFx";
import { UserContextFx } from "../../../fx/UserContextFx";
import type { UploadCreateSchema } from "../schema/UploadCreateSchema";
import { uploadFetchFx } from "./uploadFetchFx";

export namespace uploadCreateFx {
	export interface Props {
		data: UploadCreateSchema.Type;
	}
}

export const uploadCreateFx = ({ data: { url } }: uploadCreateFx.Props) => {
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

		yield* Effect.promise(async () => {
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
			query: {
				where: {
					id,
				},
			},
		});
	});
};

export type uploadCreateFx = ReturnType<typeof uploadCreateFx>;
