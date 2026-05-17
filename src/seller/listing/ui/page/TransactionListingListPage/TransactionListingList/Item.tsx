import { Badge } from "@/lib/client/badge";
import { Container } from "@/lib/client/container";
import { withFallback } from "@/lib/client/fallback";
import { LinkTo } from "@/lib/client/link-to";
import { useLocale } from "@/lib/client/locale";
import { useTranslator } from "@/lib/client/translation";
import { Tx } from "@/lib/client/tx";
import type { MarkSuspense } from "@/lib/client/type";
import { Typo } from "@/lib/client/typo";
import { toTimeDiff } from "@/lib/common/time";
import { toLocaleNumber } from "@/lib/common/to-locale-number";
import { useUpload } from "~/common/gallery/hook/useUpload";
import { Image } from "~/common/list-item/Image";
import { ListItem } from "~/common/list-item/ListItem";
import { ListItemPending } from "~/common/list-item/ListItemPending";
import { withListingQuery } from "~/seller/listing/query/withListingQuery";
import { toActivityLabel } from "~/seller/transaction/ui/toActivityLabel";

export namespace Item {
	export interface Props extends ListItem.PropsEx, MarkSuspense.Props {
		transactionListingId: string;
	}
}

export const Item = withFallback(({ _suspense, transactionListingId, ...props }: Item.Props) => {
	const locale = useLocale();
	const translator = useTranslator();
	const { data: transactionListing } = withListingQuery.useFetchQuery(transactionListingId);
	const transactionEntry = transactionListing.withTransactionEntry;
	const hero = useUpload(transactionListing.withImageUrl);
	const isUnread = transactionListing.withUnreadCount > 0;

	if (!transactionEntry) {
		return null;
	}

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
						data-ui-position="relative"
						data-ui-height="full"
					>
						<Image src={hero} />

						{isUnread ? (
							<Badge
								data-ui-snap-to="bottom-left"
								data-ui-tone="secondary"
								data-ui-theme="light"
								data-ui-badge="xs"
								data-ui-font="bold"
								data-ui-opacity="8"
								data-ui-text="xs"
							>
								{transactionListing.withUnreadCount > 9
									? "9+"
									: toLocaleNumber({
											locale,
											number: transactionListing.withUnreadCount,
										})}
							</Badge>
						) : null}
					</Container>
				}
				title={
					<Container
						data-ui-flow="vertical"
						data-ui-width="full"
					>
						<Typo
							label={transactionListing.title}
							data-ui-tone="neutral"
							data-ui-theme="light"
							data-ui-color="lead"
							data-ui-display="block"
							data-ui-width="full"
							data-ui-text="sm"
						/>

						<Typo
							label={toActivityLabel({
								entry: transactionEntry,
								translator,
							})}
							data-ui-text="xs"
							data-ui-tone="neutral"
							data-ui-theme="light"
							data-ui-font="normal"
							data-ui-color="text"
							data-ui-opacity="6"
						/>
					</Container>
				}
				bottom={
					<Container
						data-ui-tone="neutral"
						data-ui-theme="light"
						data-ui-color="text"
						data-ui-flow="horizontal"
						data-ui-items="center"
						data-ui-justify="space-between"
						data-ui-text="sm"
						data-ui-width="full"
					>
						<div />

						<Tx
							label={toTimeDiff({
								locale,
								time: transactionEntry.createdAt,
							})}
							data-ui-opacity="6"
						/>
					</Container>
				}
				data-id={transactionListing.id}
				{...props}
			/>
		</LinkTo>
	);
}, ListItemPending);
