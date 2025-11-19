import { withCollection } from "@use-pico/common/collection";
import { Effect } from "effect";
import type { WithDatabase } from "../../../database/WithDatabase";
import { withUploadQueryBuilder } from "../db/withUploadQueryBuilder";
import { withUploadSelect } from "../db/withUploadSelect";
import type { UploadQuerySchema } from "../schema/UploadQuerySchema";
import { UploadSchema } from "../schema/UploadSchema";

export namespace uploadCollectionFx {
	export interface Props {
		database: WithDatabase;
		query: UploadQuerySchema.Type;
	}
}

export const uploadCollectionFx = ({
	database,
	query: { cursor, filter, where, sort },
}: uploadCollectionFx.Props) => {
	return Effect.gen(function* () {
		return yield* Effect.promise(async () => {
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
