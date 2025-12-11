import { withFetch } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { NotFoundError } from "~/error/NotFoundError";
import { withIgnoreQueryBuilder } from "~/app/ignore/db/withIgnoreQueryBuilder";
import { withIgnoreSelect } from "~/app/ignore/db/withIgnoreSelect";
import type { IgnoreQuerySchema } from "~/app/ignore/schema/IgnoreQuerySchema";
import { IgnoreSchema } from "../schema/IgnoreSchema";

export namespace ignoreFetchFx {
	export interface Props {
		query: Omit<IgnoreQuerySchema.Type, "cursor">;
	}
}

export const ignoreFetchFx = ({ query }: ignoreFetchFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;

		const data = yield* Effect.tryPromise(async () => {
			const { filter, where, sort } = query;

			return withFetch({
				select: withIgnoreSelect({
					database,
					sort,
				}),
				output: IgnoreSchema,
				filter,
				where: {
					...where,
					userId: user.id,
				},
				query: withIgnoreQueryBuilder,
			});
		});

		if (!data) {
			return yield* new NotFoundError({
				resource: "ignore",
				resourceId: "(query)",
				message: "Ignore not found",
			});
		}

		return data;
	});
};

export type ignoreFetchFx = ReturnType<typeof ignoreFetchFx>;
