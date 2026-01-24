import { Effect } from "effect";
import { sql } from "kysely";
import { match } from "ts-pattern";
import type { MessageDirectionEnumSchema } from "~/@user/message/schema/MessageDirectionEnumSchema";
import type { MessageTextSortSchema } from "~/@user/message-text/schema/MessageTextSortSchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";

export namespace withMessageTextSelectFx {
	export interface Props {
		userId: string;
		sort?: MessageTextSortSchema.Type[];
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withMessageTextSelectFx>>;
}

export const withMessageTextSelectFx = Effect.fn("withMessageTextSelectFx")(function* ({
	userId,
	sort,
}: withMessageTextSelectFx.Props) {
	const { kysely } = yield* KyselyContextFx;

	let query = kysely
		.selectFrom("message_text as mt")
		.selectAll("mt")
		.select(sql<"text">`'text'`.as("type"))
		.select((eb) =>
			eb
				.case()
				.when("mt.userId", "=", userId)
				.then<MessageDirectionEnumSchema.Type>("out")
				.else<MessageDirectionEnumSchema.Type>("in")
				.end()
				.as("direction"),
		);

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("mt.createdAt", item.direction))
			.exhaustive();
	}

	return query;
});
