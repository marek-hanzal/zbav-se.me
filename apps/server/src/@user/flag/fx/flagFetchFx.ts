import { withFetch } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { NotFoundError } from "~/error/NotFoundError";
import { withFlagQueryBuilder } from "../db/withFlagQueryBuilder";
import { withFlagSelect } from "../db/withFlagSelect";
import type { FlagQuerySchema } from "../schema/FlagQuerySchema";
import { FlagSchema } from "../schema/FlagSchema";

export namespace flagFetchFx {
	export interface Props {
		query: Omit<FlagQuerySchema.Type, "cursor">;
	}
}

export const flagFetchFx = ({ query }: flagFetchFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;

		const data = yield* Effect.tryPromise(async () => {
			const { filter, where, sort } = query;

			return withFetch({
				select: withFlagSelect({
					database,
					sort,
				}),
				output: FlagSchema,
				filter,
				where: {
					...where,
					userId: user.id,
				},
				query: withFlagQueryBuilder,
			});
		});

		if (!data) {
			return yield* new NotFoundError({
				resource: "flag",
				resourceId: "(query)",
				message: "Flag not found",
			});
		}

		return data;
	});
};

export type flagFetchFx = ReturnType<typeof flagFetchFx>;
