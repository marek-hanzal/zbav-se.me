import { Effect } from "effect";
import type { MessageTextFilterSchema } from "~/app/message-text/schema/MessageTextFilterSchema";
import type { withMessageTextSelectFx } from "./withMessageTextSelectFx";

export namespace withMessageTextQueryBuilderFx {
	export interface Props {
		select: withMessageTextSelectFx.Select;
		where?: MessageTextFilterSchema.Type;
	}

	export type Callback = (props: Props) => withMessageTextSelectFx.Select;
}

export const withMessageTextQueryBuilderFx = Effect.fn("withMessageTextQueryBuilderFx")(function* ({
	select,
	where,
}: withMessageTextQueryBuilderFx.Props) {
	let query = select;

	if (!where) {
		return yield* Effect.succeed(select);
	}

	if (where.id) {
		query = query.where("mt.id", "=", where.id);
	}

	if (where.idIn && where.idIn.length > 0) {
		query = query.where("mt.id", "in", where.idIn);
	}

	if (where.messageThreadId) {
		query = query.where("mt.messageThreadId", "=", where.messageThreadId);
	}

	return yield* Effect.succeed(query);
});
