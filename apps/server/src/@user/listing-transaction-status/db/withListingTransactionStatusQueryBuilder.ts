import type { ListingTransactionStatusFilterSchema } from "../schema/ListingTransactionStatusFilterSchema";
import type { withListingTransactionStatusSelect } from "./withListingTransactionStatusSelect";

export namespace withListingTransactionStatusQueryBuilder {
	export interface Props {
		select: withListingTransactionStatusSelect.Select;
		where?: ListingTransactionStatusFilterSchema.Type;
	}

	export type Callback = (props: Props) => withListingTransactionStatusSelect.Select;
}

export const withListingTransactionStatusQueryBuilder: withListingTransactionStatusQueryBuilder.Callback =
	({ select, where }) => {
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

		if (where.listingTransactionId) {
			query = query.where("lts.listingTransactionId", "=", where.listingTransactionId);
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
