import { useParams } from "@tanstack/react-router";
import { ArrowRightIcon } from "@use-pico/client/icon";
import { Badge } from "@use-pico/client/ui/badge";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Typo } from "@use-pico/client/ui/typo";
import type { tListingTransaction, tUserSide } from "@zbav-se.me/sdk/api/session";
import type { FC } from "react";
import { match } from "ts-pattern";
import { TransactionStatusIcon } from "~/app/listing-transaction/ui/TransactionStatusIcon";
import { TransactionStatusInline } from "~/app/listing-transaction/ui/TransactionStatusInline";

export namespace TransactionItem {
	export interface Props extends Badge.Props {
		side: tUserSide;
		listingTransaction: tListingTransaction;
	}
}

export const TransactionItem: FC<TransactionItem.Props> = ({
	side,
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
			round={"md"}
			{...props}
		>
			<LinkTo
				icon={ArrowRightIcon}
				iconPosition={"right"}
				to={match(side)
					.with("buyer", () => {
						return "/$locale/buyer/transaction/$id/view" as const;
					})
					.with("seller", () => {
						return "/$locale/seller/transaction/$id/view" as const;
					})
					.exhaustive()}
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
					side={side}
					size={"md"}
					transactionStatus={listingTransaction.status}
				/>
			</div>
		</Badge>
	);
};
