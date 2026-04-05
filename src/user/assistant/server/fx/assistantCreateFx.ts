import { Effect } from "effect";
import { DateContextFx } from "@/lib/common/date";
import { genId } from "@/lib/common/gen-id";
import { getLoggerFx } from "@/lib/common/log";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import { assistantFetchFx } from "~/user/assistant/server/fx/assistantFetchFx";
import type { AssistantCreateSchema } from "~/user/assistant/server/schema/AssistantCreateSchema";

export namespace assistantCreateFx {
	export interface Props extends AssistantCreateSchema.Type {
		userId: string;
	}
}

export const assistantCreateFx = Effect.fn("assistantCreateFx")(function* ({
	userId,
	payload,
}: assistantCreateFx.Props) {
	const logger = yield* getLoggerFx("assistantCreateFx");
	logger.debug("assistantCreateFx", {
		userId,
		payload,
	});

	return yield* withTransactionFx(
		Effect.gen(function* () {
			const { kysely } = yield* KyselyContextFx;
			const dateContext = yield* DateContextFx;

			const id = genId();
			const now = dateContext.now();

			yield* tryDbFx(async () => {
				return kysely
					.insertInto("assistant")
					.values({
						id,
						userId,
						payload: payload as any,
						createdAt: now.toJSDate().toISOString(),
					})
					.executeTakeFirstOrThrow();
			});

			return yield* assistantFetchFx({
				where: {
					id,
				},
				scope: {
					userId,
				},
			});
		}),
	);
});

export type assistantCreateFx = ReturnType<typeof assistantCreateFx>;
