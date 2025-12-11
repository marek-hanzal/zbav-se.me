import type { TransactionLocationFilterSchema } from "../schema/TransactionLocationFilterSchema";
import type { withTransactionLocationSelect } from "./withTransactionLocationSelect";

export namespace withTransactionLocationQueryBuilder {
	export interface Props {
		select: withTransactionLocationSelect.Select;
		where?: TransactionLocationFilterSchema.Type;
	}

	export type Callback = (props: Props) => withTransactionLocationSelect.Select;
}

export const withTransactionLocationQueryBuilder: withTransactionLocationQueryBuilder.Callback = ({
	select,
	where,
}) => {
	if (!where) {
		return select;
	}

	let query = select;

	if (where.id) {
		query = query.where("ltl.id", "=", where.id);
	}

	if (where.idIn && where.idIn.length > 0) {
		query = query.where("ltl.id", "in", where.idIn);
	}

	if (where.messageThreadId) {
		query = query.where("ltl.messageThreadId", "=", where.messageThreadId);
	}

	if (where.locationId) {
		query = query.where("ltl.locationId", "=", where.locationId);
	}

	if (where.side) {
		query = query.where("ltl.side", "=", where.side);
	}

	return query;
};
