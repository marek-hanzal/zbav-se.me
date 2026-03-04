import type { MarkSuspense } from "@use-pico/client/type";
import {
	zInboxBuyerMessagePayload,
	zInboxSellerMessagePayload,
	zInboxThumbPayload,
} from "@zbav-se.me/sdk/api/user";
import { withInboxQuery } from "@zbav-se.me/sdk/query/user/inbox";
import type { FC } from "react";
import { match } from "ts-pattern";
import { InboxBuyerMessageItem } from "../payload/InboxBuyerMessageItem";
import { InboxSellerMessageItem } from "../payload/InboxSellerMessageItem";
import { InboxThumbItem } from "../payload/InboxThumbItem";

export namespace Data {
	export interface Props extends MarkSuspense.Props {
		inboxId: string;
	}
}

export const Data: FC<Data.Props> = ({ _suspense, inboxId }) => {
	const { data: item } = withInboxQuery.useFetchQuery(inboxId);

	return match(item.type)
		.with("seller-message", () => (
			<InboxSellerMessageItem
				item={item}
				payload={zInboxSellerMessagePayload.parse(item.payload)}
			/>
		))
		.with("buyer-message", () => (
			<InboxBuyerMessageItem
				item={item}
				payload={zInboxBuyerMessagePayload.parse(item.payload)}
			/>
		))
		.with("thumb", () => (
			<InboxThumbItem
				item={item}
				payload={zInboxThumbPayload.parse(item.payload)}
			/>
		))
		.exhaustive();
};
