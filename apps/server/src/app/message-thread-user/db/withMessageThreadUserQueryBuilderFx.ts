import { Effect } from "effect";
import type { MessageThreadUserFilterSchema } from "~/app/message-thread-user/schema/MessageThreadUserFilterSchema";
import type { withMessageThreadUserSelectFx } from "./withMessageThreadUserSelectFx";

export namespace withMessageThreadUserQueryBuilderFx {
	export interface Props {
		select: withMessageThreadUserSelectFx.Select;
		where?: MessageThreadUserFilterSchema.Type;
	}

	export type Callback = (props: Props) => withMessageThreadUserSelectFx.Select;
}

export const withMessageThreadUserQueryBuilderFx = Effect.fn("withMessageThreadUserQueryBuilderFx")(
	function* ({ select, where }: withMessageThreadUserQueryBuilderFx.Props) {
		let query = select;

		if (!where) {
			return yield* Effect.succeed(select);
		}

		if (where.id) {
			query = query.where("mtu.id", "=", where.id);
		}

		if (where.idIn && where.idIn.length > 0) {
			query = query.where("mtu.id", "in", where.idIn);
		}

		if (where.messageThreadId) {
			query = query.where("mtu.messageThreadId", "=", where.messageThreadId);
		}

		if (where.userId) {
			query = query.where("mtu.userId", "=", where.userId);
		}

		return yield* Effect.succeed(query);
	},
);
