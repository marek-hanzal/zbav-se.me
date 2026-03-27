import { useLocale } from "@use-pico/client/hook";
import { Container } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import { Typo } from "@use-pico/client/ui/typo";
import { toTimeDiff } from "@use-pico/common/time";
import type { FC } from "react";
import { useUpload } from "~/client/@common/gallery/hook/useUpload";
import { ListItem } from "~/client/@common/list-item/ListItem";
import { withListingQuery } from "~/client/@public/listing/query/withListingQuery";
import { withInboxQuery } from "~/client/@user/inbox/query/withInboxQuery";
import type { UnfavouriteSchema } from "~/server/database/@table/InboxTableSchema/UnfavouriteSchema";

export namespace InboxUnfavouriteItem {
	export interface Props {
		item: UnfavouriteSchema.Type;
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
