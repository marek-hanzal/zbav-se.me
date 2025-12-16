import { withFetch } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { DraftSchema } from "~/@user/draft/schema/DraftSchema";
import { withDraftQueryBuilder } from "~/app/draft/db/withDraftQueryBuilder";
import { withDraftSelect } from "~/app/draft/db/withDraftSelect";
import type { DraftQuerySchema } from "~/app/draft/schema/DraftQuerySchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { NotFoundError } from "~/error/NotFoundError";

export namespace draftFetchFx {
	export type Props = DraftQuerySchema.Type;
}

export const draftFetchFx = (query: draftFetchFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;

		const data = yield* Effect.tryPromise(async () => {
			const { filter, where, sort } = query;

			return withFetch({
				select: withDraftSelect({
					database,
					sort,
				}),
				output: DraftSchema,
				filter,
				where: {
					...where,
					userId: user.id,
				},
				query: withDraftQueryBuilder,
			});
		});

		if (!data) {
			return yield* new NotFoundError({
				resource: "draft",
				resourceId: "(query)",
				message: "Draft not found",
			});
		}

		return data;
	});
};

export type draftFetchFx = ReturnType<typeof draftFetchFx>;
