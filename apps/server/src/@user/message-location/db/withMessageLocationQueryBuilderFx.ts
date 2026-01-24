import { Effect } from "effect";
import type { withMessageLocationSelectFx } from "~/@user/message-location/db/withMessageLocationSelectFx";
import type { MessageLocationFilterSchema } from "~/@user/message-location/schema/MessageLocationFilterSchema";

export namespace withMessageLocationQueryBuilderFx {
	export interface Props {
		select: withMessageLocationSelectFx.Select;
		where?: MessageLocationFilterSchema.Type;
	}

	export type Callback = (props: Props) => withMessageLocationSelectFx.Select;
}

export const withMessageLocationQueryBuilderFx = Effect.fn("withMessageLocationQueryBuilderFx")(
	function* ({ select, where }: withMessageLocationQueryBuilderFx.Props) {
		let query = select;

		if (!where) {
			return yield* Effect.succeed(select);
		}

		if (where.id) {
			query = query.where("ml.id", "=", where.id);
		}

		if (where.idIn && where.idIn.length > 0) {
			query = query.where("ml.id", "in", where.idIn);
		}

		if (where.messageThreadId) {
			query = query.where("ml.messageThreadId", "=", where.messageThreadId);
		}

		if (where.userId) {
			query = query.where("ml.userId", "=", where.userId);
		}

		if (where.locationId) {
			query = query.where("ml.locationId", "=", where.locationId);
		}

		return yield* Effect.succeed(query);
	},
);
