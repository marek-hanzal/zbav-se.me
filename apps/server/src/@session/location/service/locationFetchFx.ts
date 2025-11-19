import { withFetch } from "@use-pico/common/fetch";
import { Effect } from "effect";
import type { WithDatabase } from "../../../database/WithDatabase";
import { NotFoundError } from "../../../error/NotFoundError";
import { withLocationQueryBuilder } from "../db/withLocationQueryBuilder";
import { withLocationSelect } from "../db/withLocationSelect";
import type { LocationQuerySchema } from "../schema/LocationQuerySchema";
import { LocationSchema } from "../schema/LocationSchema";

export namespace locationFetchFx {
	export interface Props {
		database: WithDatabase;
		query: LocationQuerySchema.Type;
	}
}

export const locationFetchFx = ({ database, query }: locationFetchFx.Props) => {
	return Effect.gen(function* () {
		const data = yield* Effect.promise(async () => {
			const { filter, where, sort } = query;

			return withFetch({
				select: withLocationSelect({
					database,
					sort,
				}),
				output: LocationSchema,
				filter,
				where,
				query: withLocationQueryBuilder,
			});
		});

		if (!data) {
			return yield* new NotFoundError({
				resource: "location",
				resourceId: "(query)",
				message: "Location not found",
			});
		}

		return data;
	});
};

export type locationFetchFx = ReturnType<typeof locationFetchFx>;
