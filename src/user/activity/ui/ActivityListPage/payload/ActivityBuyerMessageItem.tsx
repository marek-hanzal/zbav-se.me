import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { LinkTo } from "@/lib/client/link-to";
import { useLocale } from "@/lib/client/locale";
import { Tx } from "@/lib/client/tx";
import { Typo } from "@/lib/client/typo";
import { toTimeDiff } from "@/lib/common/time";
import { useUpload } from "~/common/gallery/hook/useUpload";
import { ListItem } from "~/common/list-item/ListItem";
import { withTransactionQuery } from "~/seller/transaction/query/withTransactionQuery";
import type { BuyerMessageSchema } from "~/server/database/@table/ActivityTableSchema/BuyerMessageSchema";

export namespace ActivityBuyerMessageItem {
	export interface Props {
		item: BuyerMessageSchema.Type;
	}
}

export const ActivityBuyerMessageItem: FC<ActivityBuyerMessageItem.Props> = ({ item }) => {
	const locale = useLocale();
	const { data: transaction } = withTransactionQuery.useFetchQuery(item.payload.transactionId);
	const hero = useUpload(transaction.gallery.items);

	return (
		<LinkTo
			data-id={item.id}
			data-ui={"ActivityBuyerMessageItem"}
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
