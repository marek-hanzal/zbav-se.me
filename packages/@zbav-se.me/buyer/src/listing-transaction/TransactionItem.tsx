import { Badge } from "@use-pico/client/ui/badge";
import { TransactionStatusIcon } from "@zbav-se.me/common/listing-transaction";
import type { tListingTransaction } from "@zbav-se.me/sdk/api/user";
import type { FC, ReactNode } from "react";
import { TransactionStatusInline } from "./TransactionStatusInline";

export namespace TransactionItem {
	export namespace Item {
		export interface Props {
			listingTransaction: tListingTransaction;
		}

		export type RenderFn = (props: Item.Props) => ReactNode;
	}

	export interface Props extends Omit<Badge.Props, "children"> {
		locale: string;
		listingTransaction: tListingTransaction;
		item: Item.RenderFn;
	}
}

export const TransactionItem: FC<TransactionItem.Props> = ({
	locale,
	listingTransaction,
	tweak,
	item,
	...props
}) => {
	return (
		<Badge
			size={"xl"}
			tweak={[
				tweak,
				{
					slot: {
						root: {
							class: [
								"flex",
								"flex-col",
								"gap-2",
								"h-fit",
								"w-full",
								"p-4",
								"items-start",
							],
						},
					},
				},
			]}
			round={"default"}
			{...props}
		>
			{item({
				listingTransaction,
			})}

			<div className={"flex flex-row gap-2 items-center justify-between w-full"}>
				<TransactionStatusIcon
					transactionStatus={listingTransaction.status}
					size={"sm"}
				/>

				<TransactionStatusInline
					size={"md"}
					transactionStatus={listingTransaction.status}
				/>
			</div>
		</Badge>
	);
};
