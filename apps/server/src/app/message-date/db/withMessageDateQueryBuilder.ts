import type { MessageDateFilterSchema } from "~/app/message-date/schema/MessageDateFilterSchema";
import type { withMessageDateSelect } from "./withMessageDateSelect";

export namespace withMessageDateQueryBuilder {
	export interface Props {
		select: withMessageDateSelect.Select;
		where?: MessageDateFilterSchema.Type;
	}

	export type Callback = (props: Props) => withMessageDateSelect.Select;
}

export const withMessageDateQueryBuilder: withMessageDateQueryBuilder.Callback = ({
	select,
	where,
}) => {
	if (!where) {
		return select;
	}

	let query = select;

	if (where.id) {
		query = query.where("md.id", "=", where.id);
	}

	if (where.idIn && where.idIn.length > 0) {
		query = query.where("md.id", "in", where.idIn);
	}

	if (where.messageThreadId) {
		query = query.where("md.messageThreadId", "=", where.messageThreadId);
	}

	if (where.userId) {
		query = query.where("md.userId", "=", where.userId);
	}

	return query;
};
