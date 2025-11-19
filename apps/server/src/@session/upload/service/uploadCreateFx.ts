import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { AppEnv } from "../../../AppEnv";
import type { WithDatabase } from "../../../database/WithDatabase";
import { InvalidRequestError } from "../../../error/InvalidRequestError";
import type { UploadCreateSchema } from "../schema/UploadCreateSchema";
import { uploadFetchFx } from "./uploadFetchFx";

export namespace uploadCreateFx {
	export interface Props {
		database: WithDatabase;
		userId: string;
		data: UploadCreateSchema.Type;
	}
}

export const uploadCreateFx = ({ database, userId, data: { url } }: uploadCreateFx.Props) => {
	return Effect.gen(function* () {
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
					userId,
					url,
					createdAt: now,
				})
				.execute();
		});

		return yield* uploadFetchFx({
			database,
			query: {
				where: {
					id,
				},
			},
		});
	});
};

export type uploadCreateFx = ReturnType<typeof uploadCreateFx>;
