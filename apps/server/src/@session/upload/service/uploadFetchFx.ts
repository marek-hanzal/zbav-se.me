import { withFetch } from "@use-pico/common/fetch";
import { Effect } from "effect";
import type { WithDatabase } from "../../../database/WithDatabase";
import { NotFoundError } from "../../../error/NotFoundError";
import { withUploadQueryBuilder } from "../db/withUploadQueryBuilder";
import { withUploadSelect } from "../db/withUploadSelect";
import type { UploadQuerySchema } from "../schema/UploadQuerySchema";
import { UploadSchema } from "../schema/UploadSchema";

export namespace uploadFetchFx {
	export interface Props {
		database: WithDatabase;
		query: Omit<UploadQuerySchema.Type, "cursor">;
	}
}

export const uploadFetchFx = ({ database, query }: uploadFetchFx.Props) => {
	return Effect.gen(function* () {
		const data = yield* Effect.promise(async () => {
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
