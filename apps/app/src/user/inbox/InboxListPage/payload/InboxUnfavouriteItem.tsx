import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { useLocale } from "@/lib/client/locale";
import { Tx } from "@/lib/client/tx";
import { Typo } from "@/lib/client/typo";
import { toTimeDiff } from "@use-pico/common/time";
import { useUpload } from "~/common/gallery/hook/useUpload";
import { ListItem } from "~/common/list-item/ListItem";
import { withListingQuery } from "~/public/listing/query/withListingQuery";
import type { UnfavouriteSchema } from "~/server/database/@table/InboxTableSchema/UnfavouriteSchema";
import { withInboxQuery } from "~/user/inbox/query/withInboxQuery";

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
