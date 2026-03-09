import { useLocale } from "@use-pico/client/hook";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Tx } from "@use-pico/client/ui/tx";
import { Typo } from "@use-pico/client/ui/typo";
import { toTimeDiff } from "@use-pico/common/time";
import type { tInbox, zInboxBuyerMessagePayload } from "@zbav-se.me/sdk/api/user";
import { withListingQuery } from "@zbav-se.me/sdk/query/seller/listing";
import { withInboxQuery } from "@zbav-se.me/sdk/query/user/inbox";
import type { FC } from "react";
import { useUpload } from "~/app/@common/gallery/hook/useUpload";
import { ListItem } from "~/app/@common/list-item/ListItem";

export namespace InboxBuyerMessageItem {
	export interface Props {
		item: tInbox;
		payload: zInboxBuyerMessagePayload;
	}
}

export const InboxBuyerMessageItem: FC<InboxBuyerMessageItem.Props> = ({ item, payload }) => {
	const locale = useLocale();
	const { data: listing } = withListingQuery.useFetchQuery(payload.listingId);
	const hero = useUpload(listing.gallery.items);
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
				listingId: payload.listingId,
				transactionId: payload.transactionId,
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
							label={listing.title}
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
