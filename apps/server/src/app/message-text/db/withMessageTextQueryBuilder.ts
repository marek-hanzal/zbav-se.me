import type { MessageTextFilterSchema } from "~/app/message-text/schema/MessageTextFilterSchema";
import type { withMessageTextSelect } from "./withMessageTextSelect";

export namespace withMessageTextQueryBuilder {
	export interface Props {
		select: withMessageTextSelect.Select;
		where?: MessageTextFilterSchema.Type;
	}

	export type Callback = (props: Props) => withMessageTextSelect.Select;
}

export const withMessageTextQueryBuilder: withMessageTextQueryBuilder.Callback = ({
	select,
	where,
}) => {
	if (!where) {
		return select;
	}

	let query = select;

	if (where.id) {
		query = query.where("mt.id", "=", where.id);
	}

	if (where.idIn && where.idIn.length > 0) {
		query = query.where("mt.id", "in", where.idIn);
	}

	if (where.messageThreadId) {
		query = query.where("mt.messageThreadId", "=", where.messageThreadId);
	}

	return query;
};
