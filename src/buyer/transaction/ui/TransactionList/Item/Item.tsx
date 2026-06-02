import { Container } from "@/lib/client/container";
import { withFallback } from "@/lib/client/fallback";
import { LinkTo } from "@/lib/client/link-to";
import { useLocale } from "@/lib/client/locale";
import { Tx } from "@/lib/client/tx";
import type { MarkSuspense } from "@/lib/client/type";
import { toTimeDiff } from "@/lib/common/time";
import { withTransactionQuery } from "~/buyer/transaction/query/withTransactionQuery";
import { useUpload } from "~/common/gallery/hook/useUpload";
import { ListItem } from "~/common/list-item/ListItem";
import { ListItemPending } from "~/common/list-item/ListItemPending";

export namespace Item {
	export interface Props extends ListItem.PropsEx, MarkSuspense.Props {
		transactionId: string;
	}
}

export const Item = withFallback(({ _suspense, transactionId, ...props }: Item.Props) => {
	const locale = useLocale();
	const { data: transaction } = withTransactionQuery.useFetchQuery(transactionId);
	const hero = useUpload(transaction.withImageUrl);

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
							label={toTimeDiff({
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
