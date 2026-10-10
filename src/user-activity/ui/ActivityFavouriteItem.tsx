import type { FC } from "react";
import type { FavouriteSchema } from "~/database/schema/ActivityTableFavouriteSchema";
import { toTimeDiffFn } from "~/date/fn/toTimeDiffFn";
import { getUploadFn } from "~/gallery/fn/getUploadFn";
import { ListItem } from "~/list-item/ui/ListItem";
import { useLocale } from "~/locale/hook/useLocale";
import { withListingQuery } from "~/public-listing/query/withListingQuery";
import { Tx } from "~/translation/ui/Tx";
import { Container } from "~/ui/ui/Container";
import { Typo } from "~/ui/ui/Typo";
import { withActivityQuery } from "~/user-activity/query/withActivityQuery";

export namespace ActivityFavouriteItem {
	export interface Props {
		item: FavouriteSchema.Type;
	}
}

export const ActivityFavouriteItem: FC<ActivityFavouriteItem.Props> = ({ item }) => {
	const locale = useLocale();
	const { data: listing } = withListingQuery.useFetchQuery(item.payload.listingId);
	const hero = getUploadFn(listing.withImageUrl);
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
						label={toTimeDiffFn({
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
