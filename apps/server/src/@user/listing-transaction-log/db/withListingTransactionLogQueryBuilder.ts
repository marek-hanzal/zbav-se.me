import type { ListingTransactionLogFilterSchema } from "../schema/ListingTransactionLogFilterSchema";
import type { withListingTransactionLogSelect } from "./withListingTransactionLogSelect";

export namespace withListingTransactionLogQueryBuilder {
	export interface Props {
		select: withListingTransactionLogSelect.Select;
		where?: ListingTransactionLogFilterSchema.Type;
	}

	export type Callback = (props: Props) => withListingTransactionLogSelect.Select;
}

export const withListingTransactionLogQueryBuilder: withListingTransactionLogQueryBuilder.Callback =
	({ select, where }) => {
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

		if (where.listingTransactionId) {
			query = query.where("ltl.listingTransactionId", "=", where.listingTransactionId);
		}

		if (where.status) {
			query = query.where("ltl.status", "=", where.status);
		}

		if (where.statusIn && where.statusIn.length > 0) {
			query = query.where("ltl.status", "in", where.statusIn);
		}

		if (where.side) {
			query = query.where("ltl.side", "=", where.side);
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
