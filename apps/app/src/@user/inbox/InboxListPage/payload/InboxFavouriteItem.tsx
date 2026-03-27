import { useLocale } from "@use-pico/client/hook";
import { Container } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import { Typo } from "@use-pico/client/ui/typo";
import { toTimeDiff } from "@use-pico/common/time";
import type { FC } from "react";
import { useUpload } from "~/@common/gallery/hook/useUpload";
import { ListItem } from "~/@common/list-item/ListItem";
import { withListingQuery } from "~/@public/listing/query/withListingQuery";
import { withInboxQuery } from "~/@user/inbox/query/withInboxQuery";
import type { FavouriteSchema } from "~/server/database/@table/InboxTableSchema/FavouriteSchema";

export namespace InboxFavouriteItem {
	export interface Props {
		item: FavouriteSchema.Type;
	}
}

export const InboxFavouriteItem: FC<InboxFavouriteItem.Props> = ({ item }) => {
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
					label={"Listing favourited (label)"}
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
	);
};
