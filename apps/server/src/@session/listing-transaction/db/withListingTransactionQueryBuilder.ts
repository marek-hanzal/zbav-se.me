import { match } from "ts-pattern";
import type { ListingTransactionFilterSchema } from "../schema/ListingTransactionFilterSchema";
import type { ListingTransactionMetaSchema } from "../schema/ListingTransactionMetaSchema";
import type { withListingTransactionSelect } from "./withListingTransactionSelect";

export namespace withListingTransactionQueryBuilder {
	export interface Props {
		select: withListingTransactionSelect.Select;
		where?: ListingTransactionFilterSchema.Type;
		meta?: ListingTransactionMetaSchema.Type;
	}

	export type Callback = (props: Props) => withListingTransactionSelect.Select;
}

export const withListingTransactionQueryBuilder: withListingTransactionQueryBuilder.Callback = ({
	select,
	where,
	meta,
}) => {
	if (!where) {
		return select;
	}

	let query = select;

	if (where.id) {
		query = query.where("lt.id", "=", where.id);
	}

	if (where.idIn && where.idIn.length > 0) {
		query = query.where("lt.id", "in", where.idIn);
	}

	if (where.userId) {
		const userId = where.userId;
		const userSide = meta?.side;

		query = query.where((eb) => {
			const buyerCondition = eb("lt.userId", "=", userId);
			const sellerCondition = eb.exists((ebInner) =>
				ebInner
					.selectFrom("listing as l")
					.select("l.id")
					.whereRef("l.id", "=", "lt.listingId")
					.where("l.userId", "=", userId),
			);

			return match(userSide)
				.with("buyer", () => {
					return buyerCondition;
				})
				.with("seller", () => {
					return sellerCondition;
				})
				.with(undefined, () => {
					return eb.or([
						buyerCondition,
						sellerCondition,
					]);
				})
				.exhaustive();
		});
	}

	if (where.listingId) {
		query = query.where("lt.listingId", "=", where.listingId);
	}

	if (where.status) {
		query = query.where("lt.status", "=", where.status);
	}

	if (where.side) {
		query = query.where("lt.side", "=", where.side);
	}

	return query;
};
