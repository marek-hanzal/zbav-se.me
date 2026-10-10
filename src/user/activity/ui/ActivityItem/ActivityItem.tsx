import { match } from "ts-pattern";
import { withFallback } from "@/lib/client/fallback";
import type { MarkSuspense } from "@/lib/client/type";
import { ListItemPending } from "~/common/list-item/ListItemPending";
import { withActivityQuery } from "~/user/activity/query/withActivityQuery";
import { ActivityBuyerMessageItem } from "../payload/ActivityBuyerMessageItem";
import { ActivityFavouriteItem } from "../payload/ActivityFavouriteItem";
import { ActivitySellerMessageItem } from "../payload/ActivitySellerMessageItem";
import { ActivitySystemItem } from "../payload/ActivitySystemItem";
import { ActivityThumbItem } from "../payload/ActivityThumbItem";
import { ActivityTransactionItem } from "../payload/ActivityTransactionItem";
import { ActivityUnfavouriteItem } from "../payload/ActivityUnfavouriteItem";
import { ActivityUnknownItem } from "../payload/ActivityUnknownItem";

export namespace ActivityItem {
	export interface Props extends MarkSuspense.Props {
		activityId: string;
	}
}

export const ActivityItem = withFallback(({ _suspense, activityId }: ActivityItem.Props) => {
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
