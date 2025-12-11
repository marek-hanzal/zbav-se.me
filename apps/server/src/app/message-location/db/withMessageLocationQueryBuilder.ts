import type { MessageLocationFilterSchema } from "~/app/message-location/schema/MessageLocationFilterSchema";
import type { withMessageLocationSelect } from "./withMessageLocationSelect";

export namespace withMessageLocationQueryBuilder {
	export interface Props {
		select: withMessageLocationSelect.Select;
		where?: MessageLocationFilterSchema.Type;
	}

	export type Callback = (props: Props) => withMessageLocationSelect.Select;
}

export const withMessageLocationQueryBuilder: withMessageLocationQueryBuilder.Callback = ({
	select,
	where,
}) => {
	if (!where) {
		return select;
	}

	let query = select;

	if (where.id) {
		query = query.where("ml.id", "=", where.id);
	}

	if (where.idIn && where.idIn.length > 0) {
		query = query.where("ml.id", "in", where.idIn);
	}

	if (where.messageThreadId) {
		query = query.where("ml.messageThreadId", "=", where.messageThreadId);
	}

	if (where.userId) {
		query = query.where("ml.userId", "=", where.userId);
	}

	if (where.locationId) {
		query = query.where("ml.locationId", "=", where.locationId);
	}

	return query;
};
