import type { Container } from "@use-pico/client/ui/container";
import { type FC, Suspense } from "react";
import { Data } from "./Data";
import { Item } from "./Item";
import { Pending } from "./Pending";

export namespace TransactionList {
	export interface Props extends Container.Props {
		//
	}
}

export const TransactionList: FC<TransactionList.Props> = (props) => {
	return (
		<Suspense fallback={<Pending />}>
			<Data
				_suspense={"I know"}
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
