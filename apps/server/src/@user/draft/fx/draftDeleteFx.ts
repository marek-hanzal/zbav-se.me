import { Effect } from "effect";
import type { DraftFilterSchema } from "~/@user/draft/schema/DraftFilterSchema";
import type { DraftQuerySchema } from "~/@user/draft/schema/DraftQuerySchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { draftFetchFx } from "./draftFetchFx";

export namespace draftDeleteFx {
	export interface Props extends Omit<DraftQuerySchema.Type, "cursor" | "sort"> {
		scope: DraftFilterSchema.Type;
	}
}

export const draftDeleteFx = Effect.fn("draftDeleteFx")(function* (query: draftDeleteFx.Props) {
	return yield* withTransactionFx(
		Effect.gen(function* () {
			const { kysely } = yield* KyselyContextFx;

			const draft = yield* draftFetchFx(query);

			yield* Effect.promise(async () => {
				return kysely.deleteFrom("draft").where("id", "=", draft.id).execute();
			});

			return draft;
		}),
	);
});

export type draftDeleteFx = ReturnType<typeof draftDeleteFx>;
