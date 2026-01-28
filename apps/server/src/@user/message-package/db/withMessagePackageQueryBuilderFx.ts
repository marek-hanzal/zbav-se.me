import { Effect } from "effect";
import type { withMessagePackageSelectFx } from "~/@user/message-package/db/withMessagePackageSelectFx";
import type { MessagePackageFilterSchema } from "~/@user/message-package/schema/MessagePackageFilterSchema";

export namespace withMessagePackageQueryBuilderFx {
	export interface Props {
		select: withMessagePackageSelectFx.Select;
		where?: MessagePackageFilterSchema.Type;
	}

	export type Callback = (props: Props) => withMessagePackageSelectFx.Select;
}

export const withMessagePackageQueryBuilderFx = Effect.fn("withMessagePackageQueryBuilderFx")(
	function* ({ select, where }: withMessagePackageQueryBuilderFx.Props) {
		let query = select;

		if (!where) {
			return yield* Effect.succeed(select);
		}

		if (where.id) {
			query = query.where("mp.id", "=", where.id);
		}

		if (where.idIn && where.idIn.length > 0) {
			query = query.where("mp.id", "in", where.idIn);
		}

		if (where.messageThreadId) {
			query = query.where("mp.messageThreadId", "=", where.messageThreadId);
		}

		if (where.userId) {
			query = query.where("mp.userId", "=", where.userId);
		}

		return yield* Effect.succeed(query);
	},
);
