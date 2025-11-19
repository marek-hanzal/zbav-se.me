import { withCount } from "@use-pico/common/count";
import { Effect } from "effect";
import type { WithDatabase } from "../../../database/WithDatabase";
import { withUploadQueryBuilder } from "../db/withUploadQueryBuilder";
import { withUploadSelect } from "../db/withUploadSelect";
import type { UploadQuerySchema } from "../schema/UploadQuerySchema";

export namespace uploadCountFx {
	export interface Props {
		database: WithDatabase;
		query: Omit<UploadQuerySchema.Type, "cursor" | "sort">;
	}
}

export const uploadCountFx = ({ database, query: { filter, where } }: uploadCountFx.Props) => {
	return Effect.gen(function* () {
		return yield* Effect.promise(async () => {
			return withCount({
				select: withUploadSelect({
					database,
				}),
				filter,
				where,
				query: withUploadQueryBuilder,
			});
		});
	});
};

export type uploadCountFx = ReturnType<typeof uploadCountFx>;
