import { toTimeDiffFn } from "~/date/fn/toTimeDiffFn";
import { getUploadFn } from "~/gallery/fn/getUploadFn";
import { Image } from "~/list-item/ui/Image";
import { ListItem } from "~/list-item/ui/ListItem";
import { ListItemPending } from "~/list-item/ui/ListItemPending";
import { useLocale } from "~/locale/hook/useLocale";
import { toLocaleNumberFn } from "~/number/fn/toLocaleNumberFn";
import { withListingQuery } from "~/seller-listing/query/withListingQuery";
import { toActivityLabelFn } from "~/seller-transaction/fn/toActivityLabelFn";
import { useTranslator } from "~/translation/hook/useTranslator";
import { Tx } from "~/translation/ui/Tx";
import { withFallbackFn } from "~/ui/fn/withFallbackFn";
import type { MarkSuspense } from "~/ui/type/MarkSuspense";
import { Badge } from "~/ui/ui/Badge";
import { Container } from "~/ui/ui/Container";
import { LinkTo } from "~/ui/ui/LinkTo";
import { Typo } from "~/ui/ui/Typo";

export namespace Item {
	export interface Props extends ListItem.PropsEx, MarkSuspense.Props {
		transactionListingId: string;
	}
}

export const Item = withFallbackFn(({ _suspense, transactionListingId, ...props }: Item.Props) => {
	const locale = useLocale();
	const translator = useTranslator();
	const { data: transactionListing } = withListingQuery.useFetchQuery(transactionListingId);
	const transactionEntry = transactionListing.withTransactionEntry;
	const hero = getUploadFn(transactionListing.withImageUrl);
	const isUnread = transactionListing.withUnreadCount > 0;

	if (!transactionEntry) {
		return null;
	}

	return (
		<LinkTo
			data-ui={"Item[LinkTo]"}
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
									: toLocaleNumberFn({
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
							label={toActivityLabelFn({
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
							label={toTimeDiffFn({
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
