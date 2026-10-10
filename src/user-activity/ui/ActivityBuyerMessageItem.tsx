import type { FC } from "react";
import type { BuyerMessageSchema } from "~/database/schema/ActivityTableBuyerMessageSchema";
import { toTimeDiffFn } from "~/date/fn/toTimeDiffFn";
import { getUploadFn } from "~/gallery/fn/getUploadFn";
import { ListItem } from "~/list-item/ui/ListItem";
import { useLocale } from "~/locale/hook/useLocale";
import { withTransactionQuery } from "~/seller-transaction/query/withTransactionQuery";
import { Tx } from "~/translation/ui/Tx";
import { Container } from "~/ui/ui/Container";
import { LinkTo } from "~/ui/ui/LinkTo";
import { Typo } from "~/ui/ui/Typo";

export namespace ActivityBuyerMessageItem {
	export interface Props {
		item: BuyerMessageSchema.Type;
	}
}

export const ActivityBuyerMessageItem: FC<ActivityBuyerMessageItem.Props> = ({ item }) => {
	const locale = useLocale();
	const { data: transaction } = withTransactionQuery.useFetchQuery(item.payload.transactionId);
	const hero = getUploadFn(transaction.withImageUrl);

	return (
		<LinkTo
			data-id={item.id}
			data-ui={"ActivityBuyerMessageItem[LinkTo]"}
			data-action={"open buyer activity message"}
			to="/$locale/app/seller/transaction/$transactionId/detail"
			params={{
				locale,
				transactionId: transaction.id,
			}}
		>
			<ListItem
				hero={hero}
				title={
					<Tx
						label={"New buyer message (label)"}
						data-ui-tone={item.archivedAt ? "neutral" : "secondary"}
						data-ui-theme="light"
						data-ui-font={item.archivedAt ? "normal" : "bold"}
						data-ui-color="lead"
					/>
				}
				bottom={
					<Container data-ui-flow="vertical">
						<Typo
							label={transaction.title}
							data-ui-text="sm"
						/>
						<Typo
							label={toTimeDiffFn({
								locale,
								time: item.timestamp,
							})}
							data-ui-text="xs"
							data-ui-opacity="7"
						/>
					</Container>
				}
			/>
		</LinkTo>
	);
};
