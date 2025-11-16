import { Container } from "@use-pico/client/ui/container";
import type { FC } from "react";

export namespace TransactionLogItem {
	export interface Props extends Container.Props {
		listingTransactionLog: tListingTransactionLog;
	}
}

export const TransactionLogItem: FC<TransactionLogItem.Props> = ({
	listingTransactionLog,
	tweak,
	...props
}) => {
	return (
		<Container
			tweak={[
				tweak,
			]}
			{...props}
		>
			pica
		</Container>
	);
};
