import type { FC } from "react";
import { withListingQuery as withSellerListingQuery } from "~/seller/listing/query/withListingQuery";

export namespace WarmupSeller {
	export type Props = {};
}

export const WarmupSeller: FC<WarmupSeller.Props> = () => {
	withSellerListingQuery.useCollectionQuery({
		cursor: {
			page: 0,
			size: 1000,
		},
		filter: {
			flow: "seller-to-buyer",
			withTransaction: true,
		},
		sort: [
			{
				field: "withLastAt",
				order: "desc",
			},
		],
	});
	withSellerListingQuery.useCollectionQuery({
		cursor: {
			page: 0,
			size: 1000,
		},
		filter: {
			flow: "archived",
			withTransaction: true,
		},
		sort: [
			{
				field: "withLastAt",
				order: "desc",
			},
		],
	});
	withSellerListingQuery.useCollectionQuery({
		cursor: {
			page: 0,
			size: 1000,
		},
		filter: {
			flow: "buyer-to-seller",
			withTransaction: true,
		},
		sort: [
			{
				field: "withLastAt",
				order: "desc",
			},
		],
	});
	withSellerListingQuery.useCountQuery({
		filter: {
			withTransaction: true,
		},
	});

	withSellerListingQuery.useCollectionQuery({
		cursor: {
			page: 0,
			size: 100,
		},
		sort: [
			{
				field: "createdAt",
				order: "desc",
			},
		],
	});

	return null;
};
