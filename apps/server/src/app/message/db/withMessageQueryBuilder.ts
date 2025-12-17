import type { withMessageSelect } from "~/app/message/db/withMessageSelect";
import type { MessageFilterSchema } from "~/app/message/schema/MessageFilterSchema";
import { withLikeEx } from "~/database/expression/withLikeEx";

export namespace withMessageQueryBuilder {
	export interface Props<TSelect extends withMessageSelect.Select> {
		userId: string;
		select: TSelect;
		where?: MessageFilterSchema.Type;
	}

	export type Callback<TSelect extends withMessageSelect.Select> = (
		props: Props<TSelect>,
	) => TSelect;
}

/**
 * Standalone query builder that applies all filters from MessageQuerySchema.
 * Always enforces access control (user must be a member of the message thread).
 */
export const withMessageQueryBuilder = <TSelect extends withMessageSelect.Select>({
	userId,
	select,
	where,
}: withMessageQueryBuilder.Props<TSelect>) => {
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
		return query;
	}

	if (where.id) {
		query = query.where("msg.id", "=", where.id) as TSelect;
	}

	if (where.idIn && where.idIn.length > 0) {
		query = query.where("msg.id", "in", where.idIn) as TSelect;
	}

	if (where.fulltext) {
		query = query.where((eb) =>
			withLikeEx(eb.ref("msg.text"), where.fulltext, "both"),
		) as TSelect;
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

	return query;
};
