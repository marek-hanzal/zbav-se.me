import type { TransactionLogFilterSchema } from "../schema/TransactionLogFilterSchema";
import type { withTransactionLogSelect } from "./withTransactionLogSelect";

export namespace withTransactionLogQueryBuilder {
	export interface Props {
		select: withTransactionLogSelect.Select;
		where?: TransactionLogFilterSchema.Type;
	}

	export type Callback = (props: Props) => withTransactionLogSelect.Select;
}

export const withTransactionLogQueryBuilder: withTransactionLogQueryBuilder.Callback =
	({ select, where }) => {
		if (!where) {
			return select;
		}

		let query = select;

		if (where.id) {
			query = query.where("log.id", "=", where.id);
		}

		if (where.idIn && where.idIn.length > 0) {
			query = query.where("log.id", "in", where.idIn);
		}

		if (where.messageThreadId) {
			query = query.where("log.messageThreadId", "=", where.messageThreadId);
		}

		if (where.side) {
			query = query.where("log.side", "=", where.side);
		}

		/**
		 * Listing log can see only users related to the transaction
		 */
		if (where.userId) {
			const userId = where.userId;
			query = query.where((eb) => {
				return eb.or([
					eb("lt.userId", "=", userId),
					eb("l.userId", "=", userId),
				]);
			});
		}

		return query;
	};
