import { withCollection } from "@use-pico/common/collection";
import { Effect } from "effect";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { withFlagQueryBuilder } from "../db/withFlagQueryBuilder";
import { withFlagSelect } from "../db/withFlagSelect";
import type { FlagQuerySchema } from "../schema/FlagQuerySchema";
import { FlagSchema } from "../schema/FlagSchema";

export namespace flagCollectionFx {
	export interface Props {
		query: FlagQuerySchema.Type;
	}
}

export const flagCollectionFx = ({
	query: { cursor, filter, where, sort },
}: flagCollectionFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;

		return yield* Effect.tryPromise(async () => {
			return withCollection({
				select: withFlagSelect({
					database,
					sort,
				}),
				output: FlagSchema,
				cursor: cursor ?? {
					page: 0,
					size: 10,
				},
				filter,
				where: {
					...where,
					userId: user.id,
				},
				query: withFlagQueryBuilder,
			});
		});
	});
};

export type flagCollectionFx = ReturnType<typeof flagCollectionFx>;
