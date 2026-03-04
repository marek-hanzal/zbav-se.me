import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import type { tInbox, zInboxThumbPayload } from "@zbav-se.me/sdk/api/user";
import { withListingQuery } from "@zbav-se.me/sdk/query/seller/listing";
import { CloseButton } from "@zbav-se.me/ui/button";
import type { FC } from "react";
import { useState } from "react";

export namespace InboxThumbItem {
	export interface Props extends Container.Props {
		item: tInbox;
		payload: zInboxThumbPayload;
	}
}

export const InboxThumbItem: FC<InboxThumbItem.Props> = ({ item, payload, ...props }) => {
	const [isOpen, setIsOpen] = useState(false);
	const { data: listing } = withListingQuery.useFetchQuery(payload.listingId);

	return (
		<>
			<Container
				data-ui="InboxThumbItem[Container]"
				ui={{
					border: true,
					round: "md",
					inner: "default",
					flow: "vertical",
					gap: "xs",
				}}
				{...props}
			>
				<Tx label="Inbox thumb (title)" />
				<Tx
					label={
						payload.thumb === "like" ? "Thumb like (label)" : "Thumb dislike (label)"
					}
				/>
				<Button
					onClick={() => {
						setIsOpen(true);
					}}
					ui={{
						size: "xs",
						border: true,
						round: "sm",
					}}
				>
					<Tx label="Open listing preview (button)" />
				</Button>
				<Tx
					label={
						item.priority === "high"
							? "High priority (label)"
							: "Common priority (label)"
					}
				/>
			</Container>

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
