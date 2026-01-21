import { Effect } from "effect";
import type { withMessageSourceSelectFx } from "~/app/message/db/withMessageSourceSelectFx";
import type { MessageFilterSchema } from "~/app/message/schema/MessageFilterSchema";

export namespace withMessageQueryBuilderFx {
	export interface Props<TSelect extends withMessageSourceSelectFx.Select> {
		userId: string;
		select: TSelect;
		where?: MessageFilterSchema.Type;
	}

	export type Callback<TSelect extends withMessageSourceSelectFx.Select> = (
		props: Props<TSelect>,
	) => TSelect;
}

/**
 * Standalone query builder that applies all filters from MessageQuerySchema.
 * Always enforces access control (user must be a member of the message thread).
 */
export const withMessageQueryBuilderFx = Effect.fn("withMessageQueryBuilderFx")(function* <
	TSelect extends withMessageSourceSelectFx.Select,
>({ userId, select, where }: withMessageQueryBuilderFx.Props<TSelect>) {
	let query = select;

	// Access control: user must be in the related thread.
	query = query.where((eb) => {
		return eb.exists((eb) =>
			eb
				.selectFrom("message_thread_user as mtu")
				.select("mtu.userId")
				.whereRef("mtu.messageThreadId", "=", "msg.messageThreadId")
				.where("mtu.userId", "=", userId),
		);
	}) as TSelect;

	if (!where) {
		return yield* Effect.succeed(query);
	}

	if (where.id) {
		query = query.where("msg.id", "=", where.id) as TSelect;
	}

	if (where.idIn && where.idIn.length > 0) {
		query = query.where("msg.id", "in", where.idIn) as TSelect;
	}

	if (where.messageThreadId) {
		query = query.where("msg.messageThreadId", "=", where.messageThreadId) as TSelect;
	}

	if (where.userId) {
		query = query.where("msg.userId", "=", where.userId) as TSelect;
	}

	if (where.transactionId) {
		const transactionId = where.transactionId;
		query = query.where((eb) => {
			return eb.exists((eb) =>
				eb
					.selectFrom("transaction as t")
					.select("t.id")
					.where("t.id", "=", transactionId)
					.whereRef("t.messageThreadId", "=", "msg.messageThreadId"),
			);
		}) as TSelect;
	}

	return yield* Effect.succeed(query);
});
