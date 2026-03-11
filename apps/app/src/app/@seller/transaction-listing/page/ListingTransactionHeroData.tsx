import { withTransactionQuery } from "@zbav-se.me/sdk/query/seller/transaction";
import type { FC } from "react";
import { ListingTransactionHero } from "../ListingTransactionHero";

export namespace ListingTransactionHeroData {
	export interface Props {
		transactionId: string;
	}
}

export const ListingTransactionHeroData: FC<ListingTransactionHeroData.Props> = ({
	transactionId,
}) => {
	const { data: transaction } = withTransactionQuery.useFetchQuery(transactionId);

	return (
		<ListingTransactionHero
			onClick={() => {}}
			transaction={transaction}
		/>
	);
};
