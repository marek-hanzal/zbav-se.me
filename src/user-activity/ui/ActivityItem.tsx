import { match } from "ts-pattern";
import { ListItemPending } from "~/list-item/ui/ListItemPending";
import { withFallbackFn } from "~/ui/fn/withFallbackFn";
import type { MarkSuspense } from "~/ui/type/MarkSuspense";
import { withActivityQuery } from "~/user-activity/query/withActivityQuery";
import { ActivityBuyerMessageItem } from "~/user-activity/ui/ActivityBuyerMessageItem";
import { ActivityFavouriteItem } from "~/user-activity/ui/ActivityFavouriteItem";
import { ActivitySellerMessageItem } from "~/user-activity/ui/ActivitySellerMessageItem";
import { ActivitySystemItem } from "~/user-activity/ui/ActivitySystemItem";
import { ActivityThumbItem } from "~/user-activity/ui/ActivityThumbItem";
import { ActivityTransactionItem } from "~/user-activity/ui/ActivityTransactionItem";
import { ActivityUnfavouriteItem } from "~/user-activity/ui/ActivityUnfavouriteItem";
import { ActivityUnknownItem } from "~/user-activity/ui/ActivityUnknownItem";

export namespace ActivityItem {
	export interface Props extends MarkSuspense.Props {
		activityId: string;
	}
}

export const ActivityItem = withFallbackFn(({ _suspense, activityId }: ActivityItem.Props) => {
	const { data: item } = withActivityQuery.useFetchQuery(activityId);

	return match(item)
		.with(
			{
				type: "seller-message",
			},
			(item) => <ActivitySellerMessageItem item={item} />,
		)
		.with(
			{
				type: "buyer-message",
			},
			(item) => <ActivityBuyerMessageItem item={item} />,
		)
		.with(
			{
				type: "transaction",
			},
			(item) => <ActivityTransactionItem item={item} />,
		)
		.with(
			{
				type: "system",
			},
			(item) => <ActivitySystemItem item={item} />,
		)
		.with(
			{
				type: "unknown",
			},
			(item) => <ActivityUnknownItem item={item} />,
		)
		.with(
			{
				type: "thumb",
			},
			(item) => <ActivityThumbItem item={item} />,
		)
		.with(
			{
				type: "listing.favourite",
			},
			(item) => <ActivityFavouriteItem item={item} />,
		)
		.with(
			{
				type: "unfavourite",
			},
			(item) => <ActivityUnfavouriteItem item={item} />,
		)
		.with(
			{
				type: "listing.flag",
			},
			() => "flag - not yet",
		)
		.with(
			{
				type: "unflag",
			},
			() => "unflag - not yet",
		)
		.with(
			{
				type: "listing.ignore",
			},
			() => "ignore - not yet",
		)
		.with(
			{
				type: "unignore",
			},
			() => "unignore - not yet",
		)
		.exhaustive();
}, ListItemPending);
