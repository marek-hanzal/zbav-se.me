import { Markdown } from "@use-pico/client/ui/markdown";
import type { tListingTransactionMessage } from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";
import { EventBadge } from "../../EventBadge";
import type { TransactionLogList } from "../../TransactionLogList";
import { MessageMenu } from "./MessageMenu";

export namespace MessageEvent {
	export interface Props extends Omit<EventBadge.Props, "actor" | "timestamp" | "toolbar"> {
		listingTransactionMessage: tListingTransactionMessage;
		components: TransactionLogList.Components;
	}
}

export const MessageEvent: FC<MessageEvent.Props> = ({
	listingTransactionMessage,
	components,
	...props
}) => {
	return (
		<EventBadge
			actor={listingTransactionMessage.side}
			timestamp={listingTransactionMessage.createdAt}
			toolbar={
				<MessageMenu
					locale={props.locale}
					side={props.side}
					type={props.type}
					listingTransactionMessage={listingTransactionMessage}
					components={components}
				/>
			}
			{...props}
		>
			<Markdown>{listingTransactionMessage.message}</Markdown>
		</EventBadge>
	);
};
