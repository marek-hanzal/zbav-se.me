import type { FC } from "react";
import { useUpload } from "~/common/gallery/hook/useUpload";
import { ListItem } from "~/common/list-item/ListItem";
import { toTimeDiff } from "~/date/fn/toTimeDiff";
import { useLocale } from "~/locale/hook/useLocale";
import { withListingQuery } from "~/public/listing/query/withListingQuery";
import type { FavouriteSchema } from "~/server/database/@table/ActivityTableSchema/FavouriteSchema";
import { Tx } from "~/translation/ui/Tx";
import { Container } from "~/ui/ui/Container";
import { Typo } from "~/ui/ui/Typo";
import { withActivityQuery } from "~/user/activity/query/withActivityQuery";

export namespace ActivityFavouriteItem {
	export interface Props {
		item: FavouriteSchema.Type;
	}
}

export const ActivityFavouriteItem: FC<ActivityFavouriteItem.Props> = ({ item }) => {
	const locale = useLocale();
	const { data: listing } = withListingQuery.useFetchQuery(item.payload.listingId);
	const hero = useUpload(listing.withImageUrl);
	const patchMutation = withActivityQuery.usePatchMutation({
		invalidate: [],
	});

	return (
		<ListItem
			hero={hero}
			title={
				<Tx
					label={"Listing favourited (label)"}
					data-ui-tone={item.archivedAt ? "neutral" : "secondary"}
					data-ui-theme="light"
					data-ui-font={item.archivedAt ? "normal" : "bold"}
					data-ui-color="lead"
				/>
			}
			bottom={
				<Container data-ui-flow="vertical">
					<Typo label={"listing.title"} />
					<Typo
						label={toTimeDiff({
							locale,
							time: item.timestamp,
						})}
						data-ui-text="xs"
						data-ui-opacity="7"
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
