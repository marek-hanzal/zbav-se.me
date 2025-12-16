import { Effect } from "effect";
import type { DraftQuerySchema } from "~/app/draft/schema/DraftQuerySchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { draftFetchFx } from "./draftFetchFx";

export namespace draftDeleteFx {
	export type Props = Omit<DraftQuerySchema.Type, "cursor" | "sort">;
}

export const draftDeleteFx = (query: draftDeleteFx.Props) => {
	return withTransactionFx(
		Effect.gen(function* () {
			const database = yield* DatabaseContextFx;
			const user = yield* UserContextFx;

			const draft = yield* draftFetchFx(query);

			yield* Effect.tryPromise(async () => {
				return database
					.deleteFrom("draft")
					.where("id", "=", draft.id)
					.where("userId", "=", user.id)
					.execute();
			});

			return draft;
		}),
	);
};

export type draftDeleteFx = ReturnType<typeof draftDeleteFx>;
