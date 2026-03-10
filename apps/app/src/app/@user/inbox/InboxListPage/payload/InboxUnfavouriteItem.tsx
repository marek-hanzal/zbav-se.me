import { useLocale } from "@use-pico/client/hook";
import { Container } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import { Typo } from "@use-pico/client/ui/typo";
import { toTimeDiff } from "@use-pico/common/time";
import type { tInboxUnfavourite } from "@zbav-se.me/sdk/api/user";
import { withListingQuery } from "@zbav-se.me/sdk/query/seller/listing";
import { withInboxQuery } from "@zbav-se.me/sdk/query/user/inbox";
import type { FC } from "react";
import { useUpload } from "~/app/@common/gallery/hook/useUpload";
import { ListItem } from "~/app/@common/list-item/ListItem";

export namespace InboxUnfavouriteItem {
	export interface Props {
		item: tInboxUnfavourite;
	}
}

export const InboxUnfavouriteItem: FC<InboxUnfavouriteItem.Props> = ({ item }) => {
	const locale = useLocale();
	const { data: listing } = withListingQuery.useFetchQuery(item.payload.listingId);
	const hero = useUpload(listing.gallery.items);
	const patchMutation = withInboxQuery.usePatchMutation({
		invalidate: [],
	});

	return (
		<ListItem
			hero={hero}
			title={
				<Tx
					label={"Listing unfavourited (label)"}
					ui={{
						tone: item.archivedAt ? "neutral" : "primary",
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
					<Typo label={listing.title} />
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
	);
};
