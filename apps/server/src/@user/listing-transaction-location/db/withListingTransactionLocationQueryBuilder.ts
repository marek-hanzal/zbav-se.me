import type { ListingTransactionLocationFilterSchema } from "../schema/ListingTransactionLocationFilterSchema";
import type { withListingTransactionLocationSelect } from "./withListingTransactionLocationSelect";

export namespace withListingTransactionLocationQueryBuilder {
	export interface Props {
		select: withListingTransactionLocationSelect.Select;
		where?: ListingTransactionLocationFilterSchema.Type;
	}

	export type Callback = (props: Props) => withListingTransactionLocationSelect.Select;
}

export const withListingTransactionLocationQueryBuilder: withListingTransactionLocationQueryBuilder.Callback =
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

		if (where.locationId) {
			query = query.where("ltl.locationId", "=", where.locationId);
		}

		if (where.side) {
			query = query.where("ltl.side", "=", where.side);
		}

		return query;
	};
