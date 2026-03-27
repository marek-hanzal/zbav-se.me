import { useLocale } from "@use-pico/client/hook";
import type { MarkSuspense } from "@use-pico/client/type";
import { Badge } from "@use-pico/client/ui/badge";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Tx } from "@use-pico/client/ui/tx";
import { Typo } from "@use-pico/client/ui/typo";
import { withFallback } from "@use-pico/client/utils";
import { toTimeDiff } from "@use-pico/common/time";
import { toLocaleNumber } from "@use-pico/common/to-locale-number";
import { useUpload } from "~/client/@common/gallery/hook/useUpload";
import { Image } from "~/client/@common/list-item/Image";
import { ListItem } from "~/client/@common/list-item/ListItem";
import { ListItemPending } from "~/client/@common/list-item/ListItemPending";
import { toActivityLabel } from "~/client/@seller/transaction/~public/toStatusLabel";
import { withTransactionListingQuery } from "~/client/@seller/transaction-listing/withTransactionListingQuery";

export namespace Item {
	export interface Props extends ListItem.PropsEx, MarkSuspense.Props {
		transactionListingId: string;
	}
}

export const Item = withFallback(({ _suspense, transactionListingId, ...props }: Item.Props) => {
	const locale = useLocale();
	const { data: transactionListing } =
		withTransactionListingQuery.useFetchQuery(transactionListingId);
	const hero = useUpload(transactionListing.gallery.items);
	const unreadCount = transactionListing.unreadCount;
	const isUnread = unreadCount > 0;

	return (
		<LinkTo
			data-ui={"Item"}
			to={"/$locale/app/seller/transaction/$listingId/list"}
			params={{
				locale,
				listingId: transactionListing.id,
			}}
		>
			<ListItem
				hero={
					<Container
						ui={{
							position: "relative",
							height: "full",
						}}
					>
						<Image src={hero.url} />

						{isUnread ? (
							<Badge
								ui={{
									snapTo: "bottom-left",
									tone: "secondary",
									theme: "light",
									badge: "xs",
									font: "bold",
									opacity: "8",
									text: "xs",
								}}
							>
								{unreadCount > 9
									? "9+"
									: toLocaleNumber({
											locale,
											number: unreadCount,
										})}
							</Badge>
						) : null}
					</Container>
				}
				title={
					<Container
						ui={{
							flow: "vertical",
							width: "full",
						}}
					>
						<Typo
							label={transactionListing.title}
							ui={{
								tone: "neutral",
								theme: "light",
								color: "lead",
								display: "block",
								width: "full",
								text: "sm",
							}}
						/>

						<Typo
							label={toActivityLabel({
								entry: transactionListing.entry,
							})}
							ui={{
								text: "xs",
								tone: "neutral",
								theme: "light",
								font: "normal",
								color: "text",
								opacity: "6",
							}}
						/>
					</Container>
				}
				bottom={
					<Container
						ui={{
							tone: "neutral",
							theme: "light",
							color: "text",
							flow: "horizontal",
							items: "center",
							justify: "space-between",
							text: "sm",
							width: "full",
						}}
					>
						<div />

						<Tx
							label={toTimeDiff({
								locale,
								time: transactionListing.entry.createdAt,
							})}
							ui={{
								opacity: "6",
							}}
						/>
					</Container>
				}
				data-id={transactionListing.id}
				{...props}
			/>
		</LinkTo>
	);
}, ListItemPending);
