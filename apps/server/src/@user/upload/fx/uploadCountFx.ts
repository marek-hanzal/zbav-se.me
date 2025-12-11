import { withCount } from "@use-pico/common/count";
import { Effect } from "effect";
import { withUploadQueryBuilder } from "~/app/upload/db/withUploadQueryBuilder";
import { withUploadSelect } from "~/app/upload/db/withUploadSelect";
import type { UploadQuerySchema } from "~/app/upload/schema/UploadQuerySchema";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";

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
