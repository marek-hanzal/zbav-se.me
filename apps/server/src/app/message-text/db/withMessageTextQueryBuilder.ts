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
		query = query.where("m.id", "=", where.id);
	}

	if (where.idIn && where.idIn.length > 0) {
		query = query.where("m.id", "in", where.idIn);
	}

	if (where.messageThreadId) {
		query = query.where("m.messageThreadId", "=", where.messageThreadId);
	}

	if (where.side) {
		query = query.where("m.side", "=", where.side);
	}

	return query;
};
