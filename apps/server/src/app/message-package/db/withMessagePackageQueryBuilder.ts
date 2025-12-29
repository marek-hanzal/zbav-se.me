import type { MessagePackageFilterSchema } from "~/app/message-package/schema/MessagePackageFilterSchema";
import type { withMessagePackageSelect } from "./withMessagePackageSelect";

export namespace withMessagePackageQueryBuilder {
	export interface Props {
		select: withMessagePackageSelect.Select;
		where?: MessagePackageFilterSchema.Type;
	}

	export type Callback = (props: Props) => withMessagePackageSelect.Select;
}

export const withMessagePackageQueryBuilder: withMessagePackageQueryBuilder.Callback = ({
	select,
	where,
}) => {
	if (!where) {
		return select;
	}

	let query = select;

	if (where.id) {
		query = query.where("mp.id", "=", where.id);
	}

	if (where.idIn && where.idIn.length > 0) {
		query = query.where("mp.id", "in", where.idIn);
	}

	if (where.messageThreadId) {
		query = query.where("mp.messageThreadId", "=", where.messageThreadId);
	}

	if (where.userId) {
		query = query.where("mp.userId", "=", where.userId);
	}

	return query;
};
