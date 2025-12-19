import type { MessageSystemFilterSchema } from "~/app/message-system/schema/MessageSystemFilterSchema";
import type { withMessageSystemSelect } from "./withMessageSystemSelect";

export namespace withMessageSystemQueryBuilder {
	export interface Props {
		select: withMessageSystemSelect.Select;
		where?: MessageSystemFilterSchema.Type;
	}

	export type Callback = (props: Props) => withMessageSystemSelect.Select;
}

export const withMessageSystemQueryBuilder: withMessageSystemQueryBuilder.Callback = ({
	select,
	where,
}) => {
	if (!where) {
		return select;
	}

	let query = select;

	if (where.id) {
		query = query.where("ms.id", "=", where.id);
	}

	if (where.idIn && where.idIn.length > 0) {
		query = query.where("ms.id", "in", where.idIn);
	}

	if (where.messageThreadId) {
		query = query.where("ms.messageThreadId", "=", where.messageThreadId);
	}

	return query;
};
