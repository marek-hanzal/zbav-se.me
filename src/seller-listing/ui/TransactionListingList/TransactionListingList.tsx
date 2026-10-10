import { type FC, Suspense } from "react";
import { Item } from "~/seller-listing/ui/TransactionListingList/Item";
import { Container } from "~/ui/ui/Container";

export namespace TransactionListingList {
	export interface Props extends Container.Props {
		transactionListingIds: string[];
	}
}

export const TransactionListingList: FC<TransactionListingList.Props> = ({
	transactionListingIds,
	...props
}) => {
	return (
		<Container
			data-ui={"TransactionListingList[Container]"}
			data-ui-layout="vertical-flex"
			data-ui-gap="default"
			{...props}
		>
			{transactionListingIds.map((transactionListingId) => {
				return (
					<Suspense
						key={transactionListingId}
						fallback={<Item.Fallback />}
					>
						<Item
							data-id={transactionListingId}
							_suspense={"I know"}
							transactionListingId={transactionListingId}
						/>
					</Suspense>
				);
			})}
		</Container>
	);
};
