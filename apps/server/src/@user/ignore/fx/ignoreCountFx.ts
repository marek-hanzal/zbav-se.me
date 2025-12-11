import { withCount } from "@use-pico/common/count";
import { Effect } from "effect";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { withIgnoreQueryBuilder } from "~/app/ignore/db/withIgnoreQueryBuilder";
import { withIgnoreSelect } from "~/app/ignore/db/withIgnoreSelect";
import type { IgnoreCountQuerySchema } from "../schema/IgnoreCountQuerySchema";

export namespace ignoreCountFx {
	export interface Props {
		query: IgnoreCountQuerySchema.Type;
	}
}

export const ignoreCountFx = ({ query: { filter, where } }: ignoreCountFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;

		return yield* Effect.tryPromise(async () => {
			return withCount({
				select: withIgnoreSelect({
					database,
					sort: undefined,
				}),
				filter,
				where: {
					...where,
					userId: user.id,
				},
				query: withIgnoreQueryBuilder,
			});
		});
	});
};

export type ignoreCountFx = ReturnType<typeof ignoreCountFx>;
