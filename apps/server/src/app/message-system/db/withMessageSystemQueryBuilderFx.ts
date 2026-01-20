import { Effect } from "effect";
import type { withMessageSystemSelectFx } from "~/app/message-system/db/withMessageSystemSelectFx";
import type { MessageSystemFilterSchema } from "~/app/message-system/schema/MessageSystemFilterSchema";

export namespace withMessageSystemQueryBuilderFx {
	export interface Props {
		select: withMessageSystemSelectFx.Select;
		where?: MessageSystemFilterSchema.Type;
	}

	export type Callback = (props: Props) => withMessageSystemSelectFx.Select;
}

export const withMessageSystemQueryBuilderFx = Effect.fn("withMessageSystemQueryBuilderFx")(
	function* ({ select, where }: withMessageSystemQueryBuilderFx.Props) {
		let query = select;

		if (!where) {
			return yield* Effect.succeed(select);
		}

		if (where.id) {
			query = query.where("ms.id", "=", where.id);
		}

		if (where.idIn && where.idIn.length > 0) {
			query = query.where("ms.id", "in", where.idIn);
		}

		if (where.messageThreadId) {
			query = query.where("ms.messageThreadId", "=", where.messageThreadId);
		}

		return yield* Effect.succeed(query);
	},
);
