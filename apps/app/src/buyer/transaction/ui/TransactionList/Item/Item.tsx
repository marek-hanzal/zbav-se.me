import { useLocale } from "@use-pico/client/hook";
import type { MarkSuspense } from "@use-pico/client/type";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { PriceInline } from "@use-pico/client/ui/price-inline";
import { Tx } from "@use-pico/client/ui/tx";
import { withFallback } from "@use-pico/client/utils";
import { toTimeDiff } from "@use-pico/common/time";
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
	const hero = useUpload(transaction.gallery.items);

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
						ui={{
							flow: "vertical",
							width: "full",
						}}
					>
						<Tx
							label={transaction.title}
							ui={{
								tone: "neutral",
								theme: "light",
								color: "text",
								text: "sm",
								width: "full",
								truncate: true,
							}}
						/>

						<Tx
							label={transaction.location.address}
							ui={{
								tone: "neutral",
								theme: "light",
								color: "text",
								text: "xs",
								width: "full",
								truncate: true,
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
						<PriceInline
							price={transaction.price}
							locale={locale}
							currency={transaction.currency}
						/>

						<Tx
							label={toTimeDiff({
								locale,
								time: transaction.entry.createdAt,
							})}
							ui={{
								opacity: "6",
							}}
						/>
					</Container>
				}
				{...props}
			/>
		</LinkTo>
	);
}, ListItemPending);
