import { type FC, Suspense } from "react";
import { Container } from "@/lib/client/container";
import { Item } from "./Item";

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
			data-ui={"TransactionListingList"}
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
