import { Effect } from "effect";
import { draftFetchFx } from "~/@seller-user/draft/fx/draftFetchFx";
import type { DraftFilterSchema } from "~/@seller-user/draft/schema/DraftFilterSchema";
import type { DraftQuerySchema } from "~/@seller-user/draft/schema/DraftQuerySchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { withTraceFx } from "~/effect/withTraceFx";

export namespace draftDeleteFx {
	export interface Props extends Omit<DraftQuerySchema.Type, "cursor" | "sort"> {
		scope: DraftFilterSchema.Type;
	}
}

export const draftDeleteFx = Effect.fn("draftDeleteFx")(function* (query: draftDeleteFx.Props) {
	yield* withTraceFx({
		fx: "draftDeleteFx",
		input: {
			query,
		},
	});

	return yield* withTransactionFx(
		Effect.gen(function* () {
			const { kysely } = yield* KyselyContextFx;

			const draft = yield* draftFetchFx(query);

			yield* Effect.annotateLogsScoped({
				"draftDeleteFx.draftId": draft.id,
			});

			yield* Effect.promise(async () => {
				return kysely.deleteFrom("draft").where("id", "=", draft.id).execute();
			});

			return draft;
		}),
	);
});

export type draftDeleteFx = ReturnType<typeof draftDeleteFx>;
