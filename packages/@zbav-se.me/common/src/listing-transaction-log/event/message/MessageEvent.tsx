import { Markdown } from "@use-pico/client/ui/markdown";
import type { tListingTransactionMessage } from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";
import { EventBadge } from "../../EventBadge";

export namespace MessageEvent {
	export interface Props extends Omit<EventBadge.Props, "actor" | "timestamp" | "action"> {
		message: tListingTransactionMessage;
	}
}

export const MessageEvent: FC<MessageEvent.Props> = ({ message, ...props }) => {
	return (
		<EventBadge
			actor={message.side}
			timestamp={message.createdAt}
			action={undefined}
			{...props}
		>
			<Markdown>{message.message}</Markdown>
		</EventBadge>
	);
};
