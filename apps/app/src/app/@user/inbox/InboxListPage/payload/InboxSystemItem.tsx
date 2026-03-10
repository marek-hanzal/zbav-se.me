import { useLocale } from "@use-pico/client/hook";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Tx } from "@use-pico/client/ui/tx";
import { Typo } from "@use-pico/client/ui/typo";
import { toTimeDiff } from "@use-pico/common/time";
import type { tInboxSystem } from "@zbav-se.me/sdk/api/user";
import { withInboxQuery } from "@zbav-se.me/sdk/query/user/inbox";
import type { FC } from "react";
import { match } from "ts-pattern";
import { ListItem } from "~/app/@common/list-item/ListItem";

export namespace InboxSystemItem {
	export interface Props {
		item: tInboxSystem;
	}
}

export const InboxSystemItem: FC<InboxSystemItem.Props> = ({ item }) => {
	const locale = useLocale();
	const patchMutation = withInboxQuery.usePatchMutation({
		invalidate: [
			"count",
		],
	});

	return (
		<LinkTo
			{...match(item.payload.target)
				.with("buyer", () => ({
					to: "/$locale/buyer/message/$transactionId",
					params: {
						locale,
						transactionId: item.payload.transactionId,
					},
				} as const))
				.with("seller", () => ({
					to: "/$locale/seller/message/$listingId/$transactionId",
					params: {
						locale,
						listingId: item.payload.listingId,
						transactionId: item.payload.transactionId,
					},
				} as const))
				.exhaustive()}
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
				hero={undefined}
				title={
					<Tx
						label={"System update (label)"}
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
							label={item.payload.transactionEntryId ?? item.payload.transactionId}
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
