import type { FC } from "react";
import { withTransactionQuery } from "~/buyer-transaction/query/withTransactionQuery";
import type { SellerMessageSchema } from "~/database/schema/ActivityTableSellerMessageSchema";
import { toTimeDiffFn } from "~/date/fn/toTimeDiffFn";
import { getUploadFn } from "~/gallery/fn/getUploadFn";
import { ListItem } from "~/list-item/ui/ListItem";
import { useLocale } from "~/locale/hook/useLocale";
import { Tx } from "~/translation/ui/Tx";
import { Container } from "~/ui/ui/Container";
import { LinkTo } from "~/ui/ui/LinkTo";
import { Typo } from "~/ui/ui/Typo";

export namespace ActivitySellerMessageItem {
	export interface Props {
		item: SellerMessageSchema.Type;
	}
}

export const ActivitySellerMessageItem: FC<ActivitySellerMessageItem.Props> = ({ item }) => {
	const locale = useLocale();
	const { data: transaction } = withTransactionQuery.useFetchQuery(item.payload.transactionId);
	const hero = getUploadFn(transaction.withImageUrl);

	return (
		<LinkTo
			to="/$locale/app/buyer/transaction/$transactionId/detail"
			params={{
				locale,
				transactionId: transaction.id,
			}}
		>
			<ListItem
				hero={hero}
				title={
					<Tx
						label={"New seller message (label)"}
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
