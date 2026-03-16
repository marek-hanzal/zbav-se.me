import { Container } from "@use-pico/client/ui/container";
import { type FC, Suspense } from "react";
import { Item } from "./Item";

export namespace TransactionListingList {
	export interface Props extends Container.Props {
		transactionListingIds: string[];
	}
}

export const TransactionListingList: FC<TransactionListingList.Props> = ({
	transactionListingIds,
	ui,
	...props
}) => {
	return (
		<Container
			ui={{
				layout: "vertical-flex",
				gap: "default",
				...ui,
			}}
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
