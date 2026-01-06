import { Effect } from "effect";
import { sql } from "kysely";
import { match } from "ts-pattern";
import type { MessageDirectionEnumSchema } from "~/app/message/schema/MessageDirectionEnumSchema";
import type { MessageTextSortSchema } from "~/app/message-text/schema/MessageTextSortSchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";

export namespace withMessageTextSelectFx {
	export interface Props {
		sort?: MessageTextSortSchema.Type[];
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withMessageTextSelectFx>>;
}

export const withMessageTextSelectFx = Effect.fn("withMessageTextSelectFx")(function* ({
	sort,
}: withMessageTextSelectFx.Props) {
	const database = yield* DatabaseContextFx;
	const user = yield* UserContextFx;

	let query = database
		.selectFrom("message_text as mt")
		.selectAll("mt")
		.select(sql<"text">`'text'`.as("type"))
		.select((eb) =>
			eb
				.case()
				.when("mt.userId", "=", user.id)
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
