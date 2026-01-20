import { Effect } from "effect";
import type { MessageThreadFilterSchema } from "~/app/message-thread/schema/MessageThreadFilterSchema";
import type { withMessageThreadSelectFx } from "./withMessageThreadSelectFx";

export namespace withMessageThreadQueryBuilderFx {
	export interface Props {
		select: withMessageThreadSelectFx.Select;
		where?: MessageThreadFilterSchema.Type;
	}

	export type Callback = (props: Props) => withMessageThreadSelectFx.Select;
}

export const withMessageThreadQueryBuilderFx = Effect.fn("withMessageThreadQueryBuilderFx")(
	function* ({ select, where }: withMessageThreadQueryBuilderFx.Props) {
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

		return yield* Effect.succeed(query);
	},
);
