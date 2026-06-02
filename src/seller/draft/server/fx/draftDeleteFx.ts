import { Effect } from "effect";
import { getLoggerFx } from "@/lib/common/log";
import { dbFx } from "~/server/database/fx/dbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import type { DraftQuerySchema } from "../schema/DraftQuerySchema";
import type { DraftWhereSchema } from "../schema/DraftWhereSchema";
import { draftFetchFx } from "./draftFetchFx";

export namespace draftDeleteFx {
	export interface Props extends DraftQuerySchema.Type {
		userId: string;
		scope: DraftWhereSchema.Type;
	}
}

export const draftDeleteFx = Effect.fn("draftDeleteFx")(function* ({
	userId,
	...query
}: draftDeleteFx.Props) {
	const logger = yield* getLoggerFx("draftDeleteFx");
	logger.trace("draftDeleteFx", {
		...query,
	});

	return yield* withTransactionFx(
		Effect.gen(function* () {
			const draft = yield* draftFetchFx({
				userId,
				...query,
			});

			yield* dbFx(async (kysely) => {
				return kysely.deleteFrom("draft").where("id", "=", draft.id).execute();
			});

			return draft;
		}),
	);
});

export type draftDeleteFx = ReturnType<typeof draftDeleteFx>;
