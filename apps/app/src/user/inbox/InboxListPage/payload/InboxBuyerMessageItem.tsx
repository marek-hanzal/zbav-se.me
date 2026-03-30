import { toTimeDiff } from "@use-pico/common/time";
import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { LinkTo } from "@/lib/client/link-to";
import { useLocale } from "@/lib/client/locale";
import { Tx } from "@/lib/client/tx";
import { Typo } from "@/lib/client/typo";
import { useUpload } from "~/common/gallery/hook/useUpload";
import { ListItem } from "~/common/list-item/ListItem";
import { withTransactionQuery } from "~/seller/transaction/query/withTransactionQuery";
import type { BuyerMessageSchema } from "~/server/database/@table/InboxTableSchema/BuyerMessageSchema";
import { withInboxQuery } from "~/user/inbox/query/withInboxQuery";

export namespace InboxBuyerMessageItem {
	export interface Props {
		item: BuyerMessageSchema.Type;
	}
}

export const InboxBuyerMessageItem: FC<InboxBuyerMessageItem.Props> = ({ item }) => {
	const locale = useLocale();
	const { data: transaction } = withTransactionQuery.useFetchQuery(item.payload.transactionId);
	const hero = useUpload(transaction.gallery.items);
	const patchMutation = withInboxQuery.usePatchMutation({
		invalidate: [
			"count",
		],
	});

	return (
		<LinkTo
			to="/$locale/app/seller/transaction/$transactionId/detail"
			params={{
				locale,
				transactionId: transaction.id,
			}}
			onClick={() => {
				if (item.archivedAt) {
					return;
				}
				patchMutation.mutate({
					patch: {
						archivedAt: new Date(),
					},
					query: {
						where: {
							id: item.id,
						},
					},
				});
			}}
		>
			<ListItem
				hero={hero}
				title={
					<Tx
						label={"New buyer message (label)"}
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
