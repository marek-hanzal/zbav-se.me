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
			query = query.where("log.id", "=", where.id);
		}

		if (where.idIn && where.idIn.length > 0) {
			query = query.where("log.id", "in", where.idIn);
		}

		if (where.listingTransactionId) {
			query = query.where("log.listingTransactionId", "=", where.listingTransactionId);
		}

		if (where.event) {
			query = query.where("log.event", "=", where.event);
		}

		if (where.eventIn && where.eventIn.length > 0) {
			query = query.where("log.event", "in", where.eventIn);
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
