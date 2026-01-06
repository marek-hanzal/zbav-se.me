import { Effect } from "effect";
import type { MessageLocationFilterSchema } from "~/app/message-location/schema/MessageLocationFilterSchema";
import type { withMessageLocationSelectFx} from "./withMessageLocationSelectFx;

export namespace withMessageLocationQueryBuilderFx {
	export interface Props {
		select: withMessageLocationSelectFxSelect;
		where?: MessageLocationFilterSchema.Type;
	}

	export type Callback = (props: Props) => withMessageLocationSelectFxSelect;
}

export const withMessageLocationQueryBuilderFx = Effect.fn("withMessageLocationQueryBuilderFx")(function* ({
	select,
	where,
}: withMessageLocationQueryBuilderFx.Props) {
	let query = select;

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
});
