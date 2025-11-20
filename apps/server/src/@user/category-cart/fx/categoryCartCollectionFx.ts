import { withCollection } from "@use-pico/common/collection";
import { Effect } from "effect";
import { withCategoryQueryBuilder } from "../../../@session/category/db/withCategoryQueryBuilder";
import { UserContextFx } from "../../../auth/fx/UserContextFx";
import { DatabaseContextFx } from "../../../database/fx/DatabaseContextFx";
import { withCategoryCartSelect } from "../db/withCategoryCartSelect";
import type { CategoryCartQuerySchema } from "../schema/CategoryCartQuerySchema";
import { CategoryCartSchema } from "../schema/CategoryCartSchema";

export namespace categoryCartCollectionFx {
	export interface Props {
		query: CategoryCartQuerySchema.Type;
	}
}

export const categoryCartCollectionFx = ({
	query: { cursor, filter, where, sort },
}: categoryCartCollectionFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;

		return yield* Effect.tryPromise(async () => {
			return withCollection({
				select: withCategoryCartSelect({
					database,
					sort,
					userId: user.id,
				}),
				output: CategoryCartSchema,
				cursor: cursor ?? {
					page: 0,
					size: 10,
				},
				filter,
				where,
				query: withCategoryQueryBuilder,
			});
		});
	});
};

export type categoryCartCollectionFx = ReturnType<typeof categoryCartCollectionFx>;
