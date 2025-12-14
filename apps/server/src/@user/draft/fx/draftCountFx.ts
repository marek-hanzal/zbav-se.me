import { withCount } from "@use-pico/common/count";
import { Effect } from "effect";
import { withDraftCollectionSelect } from "~/app/draft/db/withDraftCollectionSelect";
import { withDraftQueryBuilder } from "~/app/draft/db/withDraftQueryBuilder";
import type { DraftCountQuerySchema } from "~/app/draft/schema/DraftCountQuerySchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";

export namespace draftCountFx {
	export interface Props {
		query: DraftCountQuerySchema.Type;
	}
}

export const draftCountFx = ({ query }: draftCountFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;

		const { filter, where } = query;

		return yield* Effect.tryPromise(async () => {
			return withCount({
				select: withDraftCollectionSelect({
					database,
					sort: undefined,
				}),
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

export type draftCountFx = ReturnType<typeof draftCountFx>;
