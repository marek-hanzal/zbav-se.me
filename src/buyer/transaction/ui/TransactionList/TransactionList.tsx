import { type FC, Suspense } from "react";
import { Container } from "@/lib/client/container";
import { Item } from "./Item";

export namespace TransactionList {
	export interface Props extends Container.Props {
		transactionIds: string[];
	}
}

export const TransactionList: FC<TransactionList.Props> = ({ transactionIds, ...props }) => {
	return (
		<Container
			data-ui={"TransactionList"}
			ui={{
				layout: "vertical-flex",
				gap: "default",
				...ui,
			}}
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
