import type { Container } from "@use-pico/client/ui/container";
import type { tTransactionQuery } from "@zbav-se.me/sdk/api/buyer";
import { type FC, Suspense } from "react";
import { Data } from "./Data";
import { Item } from "./Item";
import { Pending } from "./Pending";

export namespace TransactionList {
	export interface Props extends Container.Props {
		query: tTransactionQuery;
	}
}

export const TransactionList: FC<TransactionList.Props> = ({ query, ...props }) => {
	return (
		<Suspense fallback={<Pending />}>
			<Data
				_suspense={"I know"}
				query={query}
				renderItem={(transactionId) => (
					<Item
						key={transactionId}
						data-id={transactionId}
						transactionId={transactionId}
					/>
				)}
				{...props}
			/>
		</Suspense>
	);
};
