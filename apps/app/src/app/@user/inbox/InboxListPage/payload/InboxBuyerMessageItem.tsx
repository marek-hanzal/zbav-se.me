import { useLocale } from "@use-pico/client/hook";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Tx } from "@use-pico/client/ui/tx";
import { Typo } from "@use-pico/client/ui/typo";
import { toTimeDiff } from "@use-pico/common/time";
import type { tInboxBuyerMessage } from "@zbav-se.me/sdk/api/user";
import { withTransactionQuery } from "@zbav-se.me/sdk/query/seller/transaction";
import { withInboxQuery } from "@zbav-se.me/sdk/query/user/inbox";
import type { FC } from "react";
import { useUpload } from "~/app/@common/gallery/hook/useUpload";
import { ListItem } from "~/app/@common/list-item/ListItem";

export namespace InboxBuyerMessageItem {
	export interface Props {
		item: tInboxBuyerMessage;
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
			to="/$locale/seller/message/$listingId/$transactionId"
			params={{
				locale,
				listingId: transaction.listingId,
				transactionId: transaction.id,
			}}
			onClick={() => {
				if (item.archivedAt) {
					return;
				}
				patchMutation.mutate({
					patch: {
						archivedAt: new Date().toISOString(),
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
