import { useParams } from "@tanstack/react-router";
import { ArrowRightIcon } from "@use-pico/client/icon";
import { Badge } from "@use-pico/client/ui/badge";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Typo } from "@use-pico/client/ui/typo";
import { TransactionStatusInline } from "@zbav-se.me/buyer/listing-transaction";
import { TransactionStatusIcon } from "@zbav-se.me/common/listing-transaction";
import type { tListingTransaction } from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";

export namespace TransactionItem {
	export interface Props extends Badge.Props {
		listingTransaction: tListingTransaction;
	}
}

export const TransactionItem: FC<TransactionItem.Props> = ({
	listingTransaction,
	tweak,
	...props
}) => {
	const { locale } = useParams({
		from: "/$locale",
	});

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
			<LinkTo
				icon={ArrowRightIcon}
				iconPosition={"right"}
				to={"/$locale/buyer/transaction/$id/view"}
				params={{
					locale,
					id: listingTransaction.id,
				}}
				full
			>
				<Typo
					label={listingTransaction.title}
					truncate
					size={"md"}
				/>
			</LinkTo>

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
