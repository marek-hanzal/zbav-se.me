import type { ListingTransactionGalleryFilterSchema } from "../schema/ListingTransactionGalleryFilterSchema";
import type { withListingTransactionGallerySelect } from "./withListingTransactionGallerySelect";

export namespace withListingTransactionGalleryQueryBuilder {
	export interface Props {
		select: withListingTransactionGallerySelect.Select;
		where?: ListingTransactionGalleryFilterSchema.Type;
	}

	export type Callback = (props: Props) => withListingTransactionGallerySelect.Select;
}

export const withListingTransactionGalleryQueryBuilder: withListingTransactionGalleryQueryBuilder.Callback =
	({ select, where }) => {
		if (!where) {
			return select;
		}

		let query = select;

		if (where.id) {
			query = query.where("ltg.id", "=", where.id);
		}

		if (where.idIn && where.idIn.length > 0) {
			query = query.where("ltg.id", "in", where.idIn);
		}

		if (where.listingTransactionId) {
			query = query.where("ltg.listingTransactionId", "=", where.listingTransactionId);
		}

		if (where.galleryId) {
			query = query.where("ltg.galleryId", "=", where.galleryId);
		}

		if (where.side) {
			query = query.where("ltg.side", "=", where.side);
		}

		return query;
	};
