import { Effect } from "effect";
import { match } from "ts-pattern";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import type { AssistantSortSchema } from "~/user/assistant/server/schema/AssistantSortSchema";

export namespace withAssistantSourceSelectFx {
	export interface Props {
		sort?: AssistantSortSchema.Type[];
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withAssistantSourceSelectFx>>;
}

export const withAssistantSourceSelectFx = Effect.fn("withAssistantSourceSelectFx")(function* ({
	sort,
}: withAssistantSourceSelectFx.Props) {
	const { kysely } = yield* KyselyContextFx;

	let query = kysely.selectFrom("assistant as a");

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("a.createdAt", item.order))
			.exhaustive();
	}

	return query;
});
