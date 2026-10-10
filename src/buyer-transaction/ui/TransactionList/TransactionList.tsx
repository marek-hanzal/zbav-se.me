import { type FC, Suspense } from "react";
import { Item } from "~/buyer-transaction/ui/TransactionList/Item.exports";
import { Container } from "~/ui/ui/Container";

export namespace TransactionList {
	export interface Props extends Container.Props {
		transactionIds: string[];
	}
}

export const TransactionList: FC<TransactionList.Props> = ({ transactionIds, ...props }) => {
	return (
		<Container
			data-ui={"TransactionList"}
			data-ui-layout="vertical-flex"
			data-ui-gap="default"
			{...props}
		>
			{transactionIds.map((transactionId) => {
				return (
					<Suspense
						key={transactionId}
						fallback={<Item.Fallback />}
					>
						<Item
							data-id={transactionId}
							_suspense={"I know"}
							transactionId={transactionId}
						/>
					</Suspense>
				);
			})}
		</Container>
	);
};
