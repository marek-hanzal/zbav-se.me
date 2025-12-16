import type { MessageThreadFilterSchema } from "~/app/message-thread/schema/MessageThreadFilterSchema";
import type { withMessageThreadSelect } from "./withMessageThreadSelect";

export namespace withMessageThreadQueryBuilder {
	export interface Props {
		select: withMessageThreadSelect.Select;
		where?: MessageThreadFilterSchema.Type;
	}

	export type Callback = (props: Props) => withMessageThreadSelect.Select;
}

export const withMessageThreadQueryBuilder: withMessageThreadQueryBuilder.Callback = ({
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

	return query;
};
