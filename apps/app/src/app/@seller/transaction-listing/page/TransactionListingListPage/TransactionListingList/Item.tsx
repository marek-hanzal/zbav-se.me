import { useLocale } from "@use-pico/client/hook";
import type { MarkSuspense } from "@use-pico/client/type";
import { Badge } from "@use-pico/client/ui/badge";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Typo } from "@use-pico/client/ui/typo";
import { withFallback } from "@use-pico/client/utils";
import { toTimeDiff } from "@use-pico/common/time";
import { toLocaleNumber } from "@use-pico/common/to-locale-number";
import { withTransactionListingQuery } from "@zbav-se.me/sdk/query/seller/transaction-listing";
import { useUpload } from "~/app/@common/gallery/hook/useUpload";
import { Image } from "~/app/@common/list-item/Image";
import { ListItem } from "~/app/@common/list-item/ListItem";
import { ListItemPending } from "~/app/@common/list-item/ListItemPending";
import { toActivityLabel } from "~/app/@seller/transaction/~public/toStatusLabel";

export namespace Item {
	export interface Props extends ListItem.PropsEx, MarkSuspense.Props {
		transactionListingId: string;
	}
}

export const Item = withFallback(
	({ _suspense, transactionListingId, ui, className, ...props }: Item.Props) => {
		const locale = useLocale();
		const { data: transactionListing } =
			withTransactionListingQuery.useFetchQuery(transactionListingId);
		const hero = useUpload(transactionListing.gallery.items);
		const unreadCount = transactionListing.unreadCount;
		const isUnread = unreadCount > 0;

		return (
			<LinkTo
				to={"/$locale/seller/transaction/$listingId/list"}
				params={{
					locale,
					listingId: transactionListing.id,
				}}
			>
				<ListItem
					data-ui={"TransactionListingList[Item]"}
					hero={
						<Container
							data-ui="TransactionListingList[Hero]"
							ui={{
								position: "relative",
								height: "full",
							}}
						>
							<Image src={hero.url} />

							{isUnread ? (
								<Badge
									data-ui="TransactionListingList[Badge]"
									ui={{
										snapTo: "bottom-left",
										tone: "secondary",
										theme: "light",
										badge: "xs",
										font: "bold",
										opacity: "8",
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
						<Typo
							label={transactionListing.title}
							ui={{
								tone: "neutral",
								theme: "light",
								color: "lead",
								font: isUnread ? "bold" : "normal",
								display: "block",
								width: "full",
							}}
							className={[
								"block",
								"w-full",
								"max-w-full",
								"min-w-0",
								"truncate",
							]}
						/>
					}
					bottom={
						<Container
							ui={{
								flow: "vertical",
								width: "full",
								items: "start",
							}}
						>
							<Typo
								label={toActivityLabel({
									entry: transactionListing.entry,
								})}
								ui={{
									text: "sm",
									tone: "neutral",
									theme: "light",
									font: "normal",
									color: "text",
								}}
								className={[
									"block",
									"min-w-0",
									"max-w-full",
									"flex-1",
									"truncate",
								]}
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
	},
	ListItemPending,
);
