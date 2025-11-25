import { Badge } from "@use-pico/client/ui/badge";
import { Markdown } from "@use-pico/client/ui/markdown";
import { Typo } from "@use-pico/client/ui/typo";
import { toTimeDiff } from "@use-pico/common/time";
import type { tListingTransactionMessage } from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";
import { EventBadge } from "../EventBadge";

export namespace MessageEvent {
	export interface Props extends Omit<EventBadge.PropsEx, "actor"> {
		locale: string;
		message: tListingTransactionMessage;
	}
}

export const MessageEvent: FC<MessageEvent.Props> = ({ locale, message, ...props }) => {
	return (
		<EventBadge
			actor={message.side}
			renderSellerFn={(props) => {
				return (
					<Badge
						ui={"MessageEvent-Seller"}
						{...props}
					>
						<Typo
							label={toTimeDiff({
								locale,
								time: message.createdAt,
							})}
							font={"normal"}
							size={"sm"}
						/>

						<Markdown>{message.message}</Markdown>
					</Badge>
				);
			}}
			renderBuyerFn={(props) => {
				return (
					<Badge
						ui={"MessageEvent-Buyer"}
						{...props}
					>
						<Typo
							label={toTimeDiff({
								locale,
								time: message.createdAt,
							})}
							font={"normal"}
							size={"sm"}
						/>

						<Markdown>{message.message}</Markdown>
					</Badge>
				);
			}}
			renderBuyerToSellerFn={(props) => {
				return (
					<Badge
						ui={"MessageEvent-BuyerToSeller"}
						{...props}
					>
						<Typo
							label={toTimeDiff({
								locale,
								time: message.createdAt,
							})}
							font={"normal"}
							size={"sm"}
						/>

						<Markdown>{message.message}</Markdown>
					</Badge>
				);
			}}
			renderSellerToBuyerFn={(props) => {
				return (
					<Badge
						ui={"MessageEvent-SellerToBuyer"}
						{...props}
					>
						<Typo
							label={toTimeDiff({
								locale,
								time: message.createdAt,
							})}
							font={"normal"}
							size={"sm"}
						/>

						<Markdown>{message.message}</Markdown>
					</Badge>
				);
			}}
			{...props}
		/>
	);
};
