import type { TransactionGalleryFilterSchema } from "../schema/TransactionGalleryFilterSchema";
import type { withTransactionGallerySelect } from "./withTransactionGallerySelect";

export namespace withTransactionGalleryQueryBuilder {
	export interface Props {
		select: withTransactionGallerySelect.Select;
		where?: TransactionGalleryFilterSchema.Type;
	}

	export type Callback = (props: Props) => withTransactionGallerySelect.Select;
}

export const withTransactionGalleryQueryBuilder: withTransactionGalleryQueryBuilder.Callback = ({
	select,
	where,
}) => {
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

	if (where.messageThreadId) {
		query = query.where("ltg.messageThreadId", "=", where.messageThreadId);
	}

	if (where.galleryId) {
		query = query.where("ltg.galleryId", "=", where.galleryId);
	}

	if (where.side) {
		query = query.where("ltg.side", "=", where.side);
	}

	return query;
};
