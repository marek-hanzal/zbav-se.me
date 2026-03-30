import { match } from "ts-pattern";
import { withFallback } from "@/lib/client/fallback";
import type { MarkSuspense } from "@/lib/client/type";
import { ListItemPending } from "~/common/list-item/ListItemPending";
import { withInboxQuery } from "~/user/inbox/query/withInboxQuery";
import { InboxBuyerMessageItem } from "../payload/InboxBuyerMessageItem";
import { InboxFavouriteItem } from "../payload/InboxFavouriteItem";
import { InboxSellerMessageItem } from "../payload/InboxSellerMessageItem";
import { InboxSystemItem } from "../payload/InboxSystemItem";
import { InboxThumbItem } from "../payload/InboxThumbItem";
import { InboxTransactionItem } from "../payload/InboxTransactionItem";
import { InboxUnfavouriteItem } from "../payload/InboxUnfavouriteItem";
import { InboxUnknownItem } from "../payload/InboxUnknownItem";

export namespace InboxItem {
	export interface Props extends MarkSuspense.Props {
		inboxId: string;
	}
}

export const InboxItem = withFallback(({ _suspense, inboxId }: InboxItem.Props) => {
	const { data: item } = withInboxQuery.useFetchQuery(inboxId);

	return match(item)
		.with(
			{
				type: "seller-message",
			},
			(item) => <InboxSellerMessageItem item={item} />,
		)
		.with(
			{
				type: "buyer-message",
			},
			(item) => <InboxBuyerMessageItem item={item} />,
		)
		.with(
			{
				type: "transaction",
			},
			(item) => <InboxTransactionItem item={item} />,
		)
		.with(
			{
				type: "system",
			},
			(item) => <InboxSystemItem item={item} />,
		)
		.with(
			{
				type: "unknown",
			},
			(item) => <InboxUnknownItem item={item} />,
		)
		.with(
			{
				type: "thumb",
			},
			(item) => <InboxThumbItem item={item} />,
		)
		.with(
			{
				type: "favourite",
			},
			(item) => <InboxFavouriteItem item={item} />,
		)
		.with(
			{
				type: "unfavourite",
			},
			(item) => <InboxUnfavouriteItem item={item} />,
		)
		.with(
			{
				type: "flag",
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
				type: "ignore",
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
