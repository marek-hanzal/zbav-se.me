import type { MessageThreadUserFilterSchema } from "~/@user/message-thread-user/schema/MessageThreadUserFilterSchema";
import type { withMessageThreadUserSelect } from "./withMessageThreadUserSelect";

export namespace withMessageThreadUserQueryBuilder {
	export interface Props {
		select: withMessageThreadUserSelect.Select;
		where?: MessageThreadUserFilterSchema.Type;
	}

	export type Callback = (props: Props) => withMessageThreadUserSelect.Select;
}

export const withMessageThreadUserQueryBuilder: withMessageThreadUserQueryBuilder.Callback = ({
	select,
	where,
}) => {
	if (!where) {
		return select;
	}

	let query = select;

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

	return query;
};
