import { withCollection } from "@use-pico/common/collection";
import { Effect } from "effect";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { withUploadQueryBuilder } from "~/app/upload/db/withUploadQueryBuilder";
import { withUploadSelect } from "~/app/upload/db/withUploadSelect";
import type { UploadQuerySchema } from "../schema/UploadQuerySchema";
import { UploadSchema } from "../schema/UploadSchema";

export namespace uploadCollectionFx {
	export interface Props {
		query: UploadQuerySchema.Type;
	}
}

export const uploadCollectionFx = ({
	query: { cursor, filter, where, sort },
}: uploadCollectionFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;

		return yield* Effect.tryPromise(async () => {
			return withCollection({
				select: withUploadSelect({
					database,
					sort,
				}),
				output: UploadSchema,
				cursor: cursor ?? {
					page: 0,
					size: 10,
				},
				filter,
				where,
				query: withUploadQueryBuilder,
			});
		});
	});
};

export type uploadCollectionFx = ReturnType<typeof uploadCollectionFx>;
