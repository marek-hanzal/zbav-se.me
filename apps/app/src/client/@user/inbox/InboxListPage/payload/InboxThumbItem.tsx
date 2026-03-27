import { useLocale } from "@use-pico/client/hook";
import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Container } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import { Typo } from "@use-pico/client/ui/typo";
import { toTimeDiff } from "@use-pico/common/time";
import { translator } from "@use-pico/common/translator";
import { CloseButton } from "@zbav-se.me/ui/button";
import type { FC } from "react";
import { useState } from "react";
import { withListingQuery } from "~/client/@buyer/listing/query/withListingQuery";
import { useUpload } from "~/client/@common/gallery/hook/useUpload";
import { ListItem } from "~/client/@common/list-item/ListItem";
import { withInboxQuery } from "~/client/@user/inbox/withInboxQuery";
import type { ThumbSchema } from "~/server/database/@table/InboxTableSchema/ThumbSchema";

export namespace InboxThumbItem {
	export interface Props {
		item: ThumbSchema.Type;
	}
}

export const InboxThumbItem: FC<InboxThumbItem.Props> = ({ item }) => {
	const locale = useLocale();
	const [isOpen, setIsOpen] = useState(false);
	const { data: listing } = withListingQuery.useFetchQuery(item.payload.listingId);
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
							item.payload.thumb === "like"
								? "You got like (label)"
								: "You got dislike (label)"
						}
						ui={{
							tone: item.archivedAt
								? "neutral"
								: item.payload.thumb === "like"
									? "secondary"
									: "neutral",
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
				onClick={() => {
					setIsOpen(true);
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
