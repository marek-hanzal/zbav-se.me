import { withCount } from "@use-pico/common/count";
import { Effect } from "effect";
import { DatabaseContextFx } from "../../../fx/DatabaseContextFx";
import { withUploadQueryBuilder } from "../db/withUploadQueryBuilder";
import { withUploadSelect } from "../db/withUploadSelect";
import type { UploadQuerySchema } from "../schema/UploadQuerySchema";

export namespace uploadCountFx {
	export interface Props {
		query: Omit<UploadQuerySchema.Type, "cursor" | "sort">;
	}
}

export const uploadCountFx = ({ query: { filter, where } }: uploadCountFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;

		return yield* Effect.tryPromise(async () => {
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
