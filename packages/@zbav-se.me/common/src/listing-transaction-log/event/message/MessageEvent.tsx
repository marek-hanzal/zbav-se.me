import { Markdown } from "@use-pico/client/ui/markdown";
import type { tListingTransactionMessage } from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";
import { EventBadge } from "../../EventBadge";

export namespace MessageEvent {
	export interface Props extends Omit<EventBadge.Props, "actor" | "timestamp" | "toolbar"> {
		listingTransactionMessage: tListingTransactionMessage;
	}
}

export const MessageEvent: FC<MessageEvent.Props> = ({ listingTransactionMessage, ...props }) => {
	return (
		<EventBadge
			actor={listingTransactionMessage.side}
			timestamp={listingTransactionMessage.createdAt}
			{...props}
		>
			<Markdown>{listingTransactionMessage.message}</Markdown>
		</EventBadge>
	);
};
