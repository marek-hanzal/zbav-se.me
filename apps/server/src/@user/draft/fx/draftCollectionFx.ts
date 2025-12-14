import { withCollection } from "@use-pico/common/collection";
import { EntitySchema } from "@use-pico/common/schema";
import { Effect } from "effect";
import { withDraftCollectionSelect } from "~/app/draft/db/withDraftCollectionSelect";
import { withDraftQueryBuilder } from "~/app/draft/db/withDraftQueryBuilder";
import type { DraftQuerySchema } from "~/app/draft/schema/DraftQuerySchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";

export namespace draftCollectionFx {
	export interface Props {
		query: DraftQuerySchema.Type;
	}
}

export const draftCollectionFx = ({
	query: { cursor, filter, where, sort },
}: draftCollectionFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;

		return yield* Effect.tryPromise(async () => {
			return withCollection({
				select: withDraftCollectionSelect({
					database,
					sort,
				}),
				output: EntitySchema,
				cursor: cursor ?? {
					page: 0,
					size: 10,
				},
				filter,
				where: {
					...where,
					userId: user.id,
				},
				query: withDraftQueryBuilder,
			});
		});
	});
};

export type draftCollectionFx = ReturnType<typeof draftCollectionFx>;
