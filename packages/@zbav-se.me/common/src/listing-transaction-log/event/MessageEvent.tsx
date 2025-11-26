import { Badge } from "@use-pico/client/ui/badge";
import { Markdown } from "@use-pico/client/ui/markdown";
import type { tListingTransactionMessage } from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";
import { EventBadge } from "../EventBadge";

export namespace MessageEvent {
	export interface Props extends Omit<EventBadge.Props, "actor" | "timestamp"> {
		message: tListingTransactionMessage;
	}
}

export const MessageEvent: FC<MessageEvent.Props> = ({ message, ...props }) => {
	return (
		<EventBadge
			actor={message.side}
			timestamp={message.createdAt}
			renderSellerFn={({ timestamp, ...props }) => {
				return (
					<Badge
						ui={"MessageEvent-Seller"}
						{...props}
					>
						{timestamp}

						<Markdown>{message.message}</Markdown>
					</Badge>
				);
			}}
			renderBuyerFn={({ timestamp, ...props }) => {
				return (
					<Badge
						ui={"MessageEvent-Buyer"}
						{...props}
					>
						{timestamp}

						<Markdown>{message.message}</Markdown>
					</Badge>
				);
			}}
			renderBuyerToSellerFn={({ timestamp, ...props }) => {
				return (
					<Badge
						ui={"MessageEvent-BuyerToSeller"}
						{...props}
					>
						{timestamp}

						<Markdown>{message.message}</Markdown>
					</Badge>
				);
			}}
			renderSellerToBuyerFn={({ timestamp, ...props }) => {
				return (
					<Badge
						ui={"MessageEvent-SellerToBuyer"}
						{...props}
					>
						{timestamp}

						<Markdown>{message.message}</Markdown>
					</Badge>
				);
			}}
			{...props}
		/>
	);
};
