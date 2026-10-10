import type { FC } from "react";
import { useUpload } from "~/common/gallery/hook/useUpload";
import { ListItem } from "~/common/list-item/ListItem";
import { toTimeDiff } from "~/date/fn/toTimeDiff";
import { useLocale } from "~/locale/hook/useLocale";
import { withTransactionQuery } from "~/seller/transaction/query/withTransactionQuery";
import type { BuyerMessageSchema } from "~/server/database/@table/ActivityTableSchema/BuyerMessageSchema";
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
	const hero = useUpload(transaction.withImageUrl);

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
							label={toTimeDiff({
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
