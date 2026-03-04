import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Container } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import { Typo } from "@use-pico/client/ui/typo";
import { translator } from "@use-pico/common/translator";
import type { tInbox, zInboxThumbPayload } from "@zbav-se.me/sdk/api/user";
import { withListingQuery } from "@zbav-se.me/sdk/query/seller/listing";
import { withInboxQuery } from "@zbav-se.me/sdk/query/user/inbox";
import { CloseButton } from "@zbav-se.me/ui/button";
import type { FC } from "react";
import { useState } from "react";
import { useUpload } from "~/app/@common/gallery/hook/useUpload";
import { ListItem } from "~/app/@common/list-item/ListItem";

export namespace InboxThumbItem {
	export interface Props {
		item: tInbox;
		payload: zInboxThumbPayload;
	}
}

export const InboxThumbItem: FC<InboxThumbItem.Props> = ({ item, payload }) => {
	const [isOpen, setIsOpen] = useState(false);
	const { data: listing } = withListingQuery.useFetchQuery(payload.listingId);
	const hero = useUpload(listing.gallery.items);
	const patchMutation = withInboxQuery.usePatchMutation({
		invalidate: [],
	});

	return (
		<>
			<ListItem
				hero={hero}
				title={
					<Tx
						label={
							payload.thumb === "like"
								? "You got like (label)"
								: "You got dislike (label)"
						}
						ui={{
							tone: item.archivedAt ? "neutral" : "primary",
							theme: "light",
							font: item.archivedAt ? "normal" : "bold",
							color: "lead",
						}}
					/>
				}
				bottom={<Typo label={listing.title} />}
				onClick={() => {
					setIsOpen(true);
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
			/>

			<BottomSheet
				data-ui="InboxThumbItem[BottomSheet]"
				isOpen={isOpen}
				onClose={() => {
					setIsOpen(false);
				}}
				header={({ close }) => ({
					title: translator.text("Inbox thumb (title)"),
					right: <CloseButton onClick={close} />,
				})}
			>
				<Container
					data-ui="InboxThumbItem-[ListingCard]"
					ui={{
						inner: "default",
						flow: "vertical",
						gap: "default",
					}}
				>
					<Tx label={listing.title} />
					<Tx label={`#${listing.id}`} />
				</Container>
			</BottomSheet>
		</>
	);
};
