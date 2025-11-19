import { withList } from "@use-pico/common/list";
import { Effect } from "effect";
import type { WithDatabase } from "../../../database/WithDatabase";
import { withLocationQueryBuilder } from "../db/withLocationQueryBuilder";
import { withLocationSelect } from "../db/withLocationSelect";
import type { LocationQuerySchema } from "../schema/LocationQuerySchema";
import { LocationSchema } from "../schema/LocationSchema";

export namespace withLocationListFx {
	export interface Props {
		database: WithDatabase;
		query: LocationQuerySchema.Type;
	}
}

export const withLocationListFx = ({
	database,
	query: { filter, where, cursor, sort },
}: withLocationListFx.Props) => {
	return Effect.gen(function* () {
		return yield* Effect.promise(async () => {
			return withList({
				select: withLocationSelect({
					database,
					sort,
				}),
				output: LocationSchema,
				filter,
				where,
				query: withLocationQueryBuilder,
				cursor,
			});
		});
	});
};

export type withLocationListFx = ReturnType<typeof withLocationListFx>;
