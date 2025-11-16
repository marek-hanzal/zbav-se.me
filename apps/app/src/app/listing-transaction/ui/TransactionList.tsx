import { Container } from "@use-pico/client/ui/container";
import type { tUserSide } from "@zbav-se.me/sdk/api/session";
import { withListingTransactionCollectionQuery } from "@zbav-se.me/sdk/query/session";
import type { FC } from "react";
import { match } from "ts-pattern";
import { BuyerEmptyList } from "~/app/listing-transaction/ui/buyer/BuyerEmptyList";
import { SellerEmptyList } from "~/app/listing-transaction/ui/seller/SellerEmptyList";
import { TransactionItem } from "~/app/listing-transaction/ui/TransactionItem";

export namespace TransactionList {
	export interface Props extends Container.Props {
		side: tUserSide;
	}
}

export const TransactionList: FC<TransactionList.Props> = ({ side, ...props }) => {
	const listingTransactionCollectionQuery =
		withListingTransactionCollectionQuery.useSuspenseQuery({
			sort: [
				{
					field: "updatedAt",
					direction: "desc",
				},
			],
			meta: {
				side,
			},
		});

	return (
		<Container
			ui="TransactionList-root"
			{...props}
		>
			{listingTransactionCollectionQuery.data.data.length > 0
				? listingTransactionCollectionQuery.data.data.map((item) => (
						<TransactionItem
							key={item.id}
							side={side}
							listingTransaction={item}
						/>
					))
				: null}

			{listingTransactionCollectionQuery.data.data.length > 0 ? null : (
				<Container
					layout={"vertical-centered"}
					items={"center"}
				>
					{match(side)
						.with("buyer", () => <BuyerEmptyList />)
						.with("seller", () => <SellerEmptyList />)
						.exhaustive()}
				</Container>
			)}
		</Container>
	);
};
