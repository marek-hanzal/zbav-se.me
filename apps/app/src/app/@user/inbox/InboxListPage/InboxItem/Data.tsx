import type { MarkSuspense } from "@use-pico/client/type";
import { withInboxQuery } from "@zbav-se.me/sdk/query/user/inbox";
import type { FC } from "react";
import { match } from "ts-pattern";
import { InboxBuyerMessageItem } from "../payload/InboxBuyerMessageItem";
import { InboxFavouriteItem } from "../payload/InboxFavouriteItem";
import { InboxSellerMessageItem } from "../payload/InboxSellerMessageItem";
import { InboxSystemItem } from "../payload/InboxSystemItem";
import { InboxThumbItem } from "../payload/InboxThumbItem";
import { InboxTransactionItem } from "../payload/InboxTransactionItem";
import { InboxUnknownItem } from "../payload/InboxUnknownItem";
import { InboxUnfavouriteItem } from "../payload/InboxUnfavouriteItem";

export namespace Data {
	export interface Props extends MarkSuspense.Props {
		inboxId: string;
	}
}

export const Data: FC<Data.Props> = ({ _suspense, inboxId }) => {
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
		.exhaustive();
};
