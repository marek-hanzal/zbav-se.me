import { useLocale } from "@use-pico/client/hook";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Tx } from "@use-pico/client/ui/tx";
import { Typo } from "@use-pico/client/ui/typo";
import { toTimeDiff } from "@use-pico/common/time";
import { withTransactionQuery } from "@zbav-se.me/sdk/query/buyer/transaction";
import type { FC } from "react";
import { useUpload } from "~/client/@common/gallery/hook/useUpload";
import { ListItem } from "~/client/@common/list-item/ListItem";
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
