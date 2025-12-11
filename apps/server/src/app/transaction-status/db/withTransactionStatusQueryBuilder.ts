import type { TransactionStatusFilterSchema } from "~/app/transaction-status/schema/TransactionStatusFilterSchema";
import type { withTransactionStatusSelect } from "./withTransactionStatusSelect";

export namespace withTransactionStatusQueryBuilder {
	export interface Props {
		select: withTransactionStatusSelect.Select;
		where?: TransactionStatusFilterSchema.Type;
	}

	export type Callback = (props: Props) => withTransactionStatusSelect.Select;
}

export const withTransactionStatusQueryBuilder: withTransactionStatusQueryBuilder.Callback = ({
	select,
	where,
}) => {
	if (!where) {
		return select;
	}

	let query = select;

	if (where.id) {
		query = query.where("lts.id", "=", where.id);
	}

	if (where.idIn && where.idIn.length > 0) {
		query = query.where("lts.id", "in", where.idIn);
	}

	if (where.transactionId) {
		query = query.where("lts.transactionId", "=", where.transactionId);
	}

	if (where.status) {
		query = query.where("lts.status", "=", where.status);
	}

	if (where.statusIn && where.statusIn.length > 0) {
		query = query.where("lts.status", "in", where.statusIn);
	}

	if (where.side) {
		query = query.where("lts.side", "=", where.side);
	}

	return query;
};
