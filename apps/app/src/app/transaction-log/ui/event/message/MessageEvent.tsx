import { Markdown } from "@use-pico/client/ui/markdown";
import type { tTransactionMessage } from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";
import { EventBadge } from "../../EventBadge";

export namespace MessageEvent {
	export interface Props extends Omit<EventBadge.Props, "actor" | "timestamp" | "toolbar"> {
		transactionMessage: tTransactionMessage;
	}
}

export const MessageEvent: FC<MessageEvent.Props> = ({ transactionMessage, ...props }) => {
	return (
		<EventBadge
			actor={transactionMessage.side}
			timestamp={transactionMessage.createdAt}
			{...props}
		>
			<Markdown
				tweak={{
					slot: {
						p: {
							class: [
								"py-0",
							],
						},
					},
				}}
			>
				{transactionMessage.message}
			</Markdown>
		</EventBadge>
	);
};
