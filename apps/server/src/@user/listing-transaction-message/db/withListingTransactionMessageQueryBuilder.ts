import type { ListingTransactionMessageFilterSchema } from "../schema/ListingTransactionMessageFilterSchema";
import type { withListingTransactionMessageSelect } from "./withListingTransactionMessageSelect";

export namespace withListingTransactionMessageQueryBuilder {
	export interface Props {
		select: withListingTransactionMessageSelect.Select;
		where?: ListingTransactionMessageFilterSchema.Type;
	}

	export type Callback = (props: Props) => withListingTransactionMessageSelect.Select;
}

export const withListingTransactionMessageQueryBuilder: withListingTransactionMessageQueryBuilder.Callback =
	({ select, where }) => {
		if (!where) {
			return select;
		}

		let query = select;

		if (where.id) {
			query = query.where("ltm.id", "=", where.id);
		}

		if (where.idIn && where.idIn.length > 0) {
			query = query.where("ltm.id", "in", where.idIn);
		}

		if (where.listingTransactionId) {
			query = query.where("ltm.listingTransactionId", "=", where.listingTransactionId);
		}

		if (where.side) {
			query = query.where("ltm.side", "=", where.side);
		}

		return query;
	};
