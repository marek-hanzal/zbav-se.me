import { useLocale } from "@use-pico/client/hook";
import type { MarkSuspense } from "@use-pico/client/type";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Tx } from "@use-pico/client/ui/tx";
import { Typo } from "@use-pico/client/ui/typo";
import { toTimeDiff } from "@use-pico/common/time";
import { toLocaleNumber } from "@use-pico/common/to-locale-number";
import { withTransactionListingQuery } from "@zbav-se.me/sdk/query/seller/transaction-listing";
import type { FC } from "react";
import { useUpload } from "~/app/@common/gallery/hook/useUpload";
import { ListItem } from "~/app/@common/list-item/ListItem";

export namespace Data {
	export interface Props extends ListItem.PropsEx, MarkSuspense.Props {
		transactionListingId: string;
	}
}

export const Data: FC<Data.Props> = ({
	_suspense,
	transactionListingId,
	ui,
	className,
	...props
}) => {
	const locale = useLocale();
	const { data: transactionListing } =
		withTransactionListingQuery.useFetchQuery(transactionListingId);
	const hero = useUpload(transactionListing.gallery.items);

	return (
		<LinkTo
			to={"/$locale/seller/message/$listingId/list"}
			params={{
				locale,
				listingId: transactionListing.id,
			}}
		>
			<ListItem
				data-ui={"TransactionListingItem[Item]"}
				hero={hero}
				title={
					<Tx
						label={transactionListing.title}
						ui={{
							tone: "brand",
							theme: "light",
							color: "lead",
							font: "bold",
							display: "block",
							width: "full",
							truncate: true,
						}}
						className={[
							"block",
							"w-full",
							"max-w-full",
							"min-w-0",
						]}
					/>
				}
				bottom={
					<Container
						ui={{
							flow: "horizontal",
							justify: "space-between",
							width: "full",
							gap: "default",
						}}
					>
						<Typo
							label={`x${toLocaleNumber({
								locale,
								number: transactionListing.count,
							})}`}
							ui={{
								text: "sm",
								opacity: "7",
							}}
						/>
						<Typo
							label={toTimeDiff({
								locale,
								time: transactionListing.lastAt,
							})}
							ui={{
								text: "xs",
								opacity: "7",
							}}
						/>
					</Container>
				}
				ui={ui}
				className={className}
				data-id={transactionListing.id}
				{...props}
			/>
		</LinkTo>
	);
};
