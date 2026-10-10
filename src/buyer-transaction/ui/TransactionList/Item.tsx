import { withTransactionQuery } from "~/buyer-transaction/query/withTransactionQuery";
import { toTimeDiffFn } from "~/date/fn/toTimeDiffFn";
import { getUploadFn } from "~/gallery/fn/getUploadFn";
import { ListItem } from "~/list-item/ui/ListItem";
import { ListItemPending } from "~/list-item/ui/ListItemPending";
import { useLocale } from "~/locale/hook/useLocale";
import { Tx } from "~/translation/ui/Tx";
import { withFallbackFn } from "~/ui/fn/withFallbackFn";
import type { MarkSuspense } from "~/ui/type/MarkSuspense";
import { Container } from "~/ui/ui/Container";
import { LinkTo } from "~/ui/ui/LinkTo";

export namespace Item {
	export interface Props extends ListItem.PropsEx, MarkSuspense.Props {
		transactionId: string;
	}
}

export const Item = withFallbackFn(({ _suspense, transactionId, ...props }: Item.Props) => {
	const locale = useLocale();
	const { data: transaction } = withTransactionQuery.useFetchQuery(transactionId);
	const hero = getUploadFn(transaction.withImageUrl);

	return (
		<LinkTo
			data-ui={"Item"}
			data-action={"open transaction detail"}
			to="/$locale/app/buyer/transaction/$transactionId/detail"
			params={{
				locale,
				transactionId,
			}}
		>
			<ListItem
				hero={hero}
				title={
					<Container
						data-ui-flow="vertical"
						data-ui-width="full"
					>
						<Tx
							label={transaction.title}
							data-ui-tone="neutral"
							data-ui-theme="light"
							data-ui-color="text"
							data-ui-text="sm"
							data-ui-width="full"
							data-ui-truncate
						/>

						<Tx
							label={transaction.location.address}
							data-ui-tone="neutral"
							data-ui-theme="light"
							data-ui-color="text"
							data-ui-text="xs"
							data-ui-width="full"
							data-ui-truncate
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
						{/* <PriceInline
							price={transaction.price}
							locale={locale}
							currency={transaction.currency}
						/> */}

						<Tx
							label={toTimeDiffFn({
								locale,
								time: transaction.entry.createdAt,
							})}
							data-ui-opacity="6"
						/>
					</Container>
				}
				{...props}
			/>
		</LinkTo>
	);
}, ListItemPending);
