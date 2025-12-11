import { withCount } from "@use-pico/common/count";
import { Effect } from "effect";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { withFlagQueryBuilder } from "~/app/flag/db/withFlagQueryBuilder";
import { withFlagSelect } from "~/app/flag/db/withFlagSelect";
import type { FlagCountQuerySchema } from "~/app/flag/schema/FlagCountQuerySchema";

export namespace flagCountFx {
	export interface Props {
		query: FlagCountQuerySchema.Type;
	}
}

export const flagCountFx = ({ query: { filter, where } }: flagCountFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;

		return yield* Effect.tryPromise(async () => {
			return withCount({
				select: withFlagSelect({
					database,
					sort: undefined,
				}),
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

export type flagCountFx = ReturnType<typeof flagCountFx>;
