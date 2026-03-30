import { LinkTo } from "@/lib/client/link-to";
import { toTimeDiff } from "@use-pico/common/time";
import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { useLocale } from "@/lib/client/locale";
import { Tx } from "@/lib/client/tx";
import { Typo } from "@/lib/client/typo";
import { withTransactionQuery } from "~/buyer/transaction/query/withTransactionQuery";
import { useUpload } from "~/common/gallery/hook/useUpload";
import { ListItem } from "~/common/list-item/ListItem";
import type { SellerMessageSchema } from "~/server/database/@table/InboxTableSchema/SellerMessageSchema";

export namespace InboxSellerMessageItem {
	export interface Props {
		item: SellerMessageSchema.Type;
	}
}

export const InboxSellerMessageItem: FC<InboxSellerMessageItem.Props> = ({ item }) => {
	const locale = useLocale();
	const { data: transaction } = withTransactionQuery.useFetchQuery(item.payload.transactionId);
	const hero = useUpload(transaction.gallery.items);

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
						ui={{
							tone: item.archivedAt ? "neutral" : "secondary",
							theme: "light",
							font: item.archivedAt ? "normal" : "bold",
							color: "lead",
						}}
					/>
				}
				bottom={
					<Container
						ui={{
							flow: "vertical",
						}}
					>
						<Typo
							label={transaction.title}
							ui={{
								text: "sm",
							}}
						/>
						<Typo
							label={toTimeDiff({
								locale,
								time: item.timestamp,
							})}
							ui={{
								text: "xs",
								opacity: "7",
							}}
						/>
					</Container>
				}
			/>
		</LinkTo>
	);
};
