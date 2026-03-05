import { Effect } from "effect";
import { draftFetchFx } from "~/@seller/draft/fx/draftFetchFx";
import type { DraftFilterSchema } from "~/@seller/draft/schema/DraftFilterSchema";
import type { DraftQuerySchema } from "~/@seller/draft/schema/DraftQuerySchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { tryDbFx } from "~/database/fx/tryDbFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { traceLogFx } from "~/effect/traceLogFx";

export namespace draftDeleteFx {
	export interface Props extends Omit<DraftQuerySchema.Type, "cursor" | "sort"> {
		scope: DraftFilterSchema.Type;
	}
}

export const draftDeleteFx = Effect.fn("draftDeleteFx")(function* (query: draftDeleteFx.Props) {
	yield* traceLogFx({
		level: "trace",
		message: "draftDeleteFx",
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

			yield* tryDbFx(async () =>
				kysely.deleteFrom("draft").where("id", "=", draft.id).execute(),
			);

			return draft;
		}),
	);
});

export type draftDeleteFx = ReturnType<typeof draftDeleteFx>;
