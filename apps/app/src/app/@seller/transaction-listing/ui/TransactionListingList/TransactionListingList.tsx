import type { MarkSuspense } from "@use-pico/client/type";
import { Container } from "@use-pico/client/ui/container";
import type { FC } from "react";
import { Item } from "./Item";

export namespace TransactionListingList {
	export interface Props extends Container.Props, MarkSuspense.Props {
		transactionListingIds: string[];
	}
}

export const TransactionListingList: FC<TransactionListingList.Props> = ({
	_suspense,
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
			{transactionListingIds.length > 0
				? transactionListingIds.map((transactionListingId) => {
						return (
							<Item
								key={transactionListingId}
								data-id={transactionListingId}
								_suspense={_suspense}
								transactionListingId={transactionListingId}
							/>
						);
					})
				: null}
		</Container>
	);
};
