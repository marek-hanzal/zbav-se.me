import type { MessageFilterSchema } from "../schema/MessageFilterSchema";
import type { withMessageSelect } from "./withMessageSelect";

export namespace withMessageQueryBuilder {
	export interface Props {
		select: withMessageSelect.Select;
		where?: MessageFilterSchema.Type;
	}

	export type Callback = (props: Props) => withMessageSelect.Select;
}

export const withMessageQueryBuilder: withMessageQueryBuilder.Callback = ({ select, where }) => {
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
