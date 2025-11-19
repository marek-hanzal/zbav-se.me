import { withFetch } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { NotFoundError } from "../../../error/NotFoundError";
import { DatabaseContextFx } from "../../../fx/DatabaseContextFx";
import { withUploadQueryBuilder } from "../db/withUploadQueryBuilder";
import { withUploadSelect } from "../db/withUploadSelect";
import type { UploadQuerySchema } from "../schema/UploadQuerySchema";
import { UploadSchema } from "../schema/UploadSchema";

export namespace uploadFetchFx {
	export interface Props {
		query: Omit<UploadQuerySchema.Type, "cursor">;
	}
}

export const uploadFetchFx = ({ query }: uploadFetchFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;

		const data = yield* Effect.tryPromise(async () => {
			const { filter, where, sort } = query;

			return withFetch({
				select: withUploadSelect({
					database,
					sort,
				}),
				output: UploadSchema,
				filter,
				where,
				query: withUploadQueryBuilder,
			});
		});

		if (!data) {
			return yield* new NotFoundError({
				resource: "upload",
				resourceId: "(query)",
				message: "Upload not found",
			});
		}

		return data;
	});
};

export type uploadFetchFx = ReturnType<typeof uploadFetchFx>;
