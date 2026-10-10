import type { FC } from "react";
import { Suspense } from "react";
import { Item } from "~/seller-listing/ui/TransactionList/Item";
import type { MarkSuspense } from "~/ui/type/MarkSuspense";
import { Container } from "~/ui/ui/Container";

export namespace List {
	export interface Props extends Container.Props, MarkSuspense.Props {
		transactionIds: string[];
	}
}

export const List: FC<List.Props> = ({ _suspense, transactionIds, ...props }) => {
	return (
		<Container
			data-ui={"List[Container]"}
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
							_suspense={_suspense}
							transactionId={transactionId}
						/>
					</Suspense>
				);
			})}
		</Container>
	);
};
