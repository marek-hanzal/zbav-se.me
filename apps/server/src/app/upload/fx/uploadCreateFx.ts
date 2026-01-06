import { genId } from "@use-pico/common/gen-id";
import type { AssertNever } from "@use-pico/common/type";
import { Effect } from "effect";
import { AppEnv } from "~/AppEnv";
import { uploadFetchFx } from "~/app/upload/fx/uploadFetchFx";
import type { UploadCreateSchema } from "~/app/upload/schema/UploadCreateSchema";
import type { UserContextFx } from "~/auth/fx/UserContextFx";
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

type _NoUser = AssertNever<Extract<Effect.Effect.Context<uploadCreateFx>, UserContextFx>>;
