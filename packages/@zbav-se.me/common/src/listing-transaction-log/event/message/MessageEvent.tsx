import { HideIcon, Icon, ShowIcon } from "@use-pico/client/icon";
import { Markdown } from "@use-pico/client/ui/markdown";
import type { tListingTransactionMessage } from "@zbav-se.me/sdk/api/user";
import { type FC, useEffect, useState } from "react";
import { EventBadge } from "../../EventBadge";
import type { TransactionLogList } from "../../TransactionLogList";
import { MessageMenu } from "./MessageMenu";

export namespace MessageEvent {
	export interface Props extends Omit<EventBadge.Props, "actor" | "timestamp" | "action"> {
		listingTransactionMessage: tListingTransactionMessage;
		components: TransactionLogList.Components;
	}
}

export const MessageEvent: FC<MessageEvent.Props> = ({
	listingTransactionMessage,
	components,
	...props
}) => {
	const [isMenuOpen, setIsMenuOpen] = useState(props.isCurrent);

	useEffect(() => {
		if (!props.isCurrent || props.isClosed) {
			return;
		}

		setTimeout(() => {
			setIsMenuOpen(true);
		}, 150);
	}, [
		props.isClosed,
		props.isCurrent,
	]);

	return (
		<>
			<EventBadge
				actor={listingTransactionMessage.side}
				timestamp={listingTransactionMessage.createdAt}
				action={
					<Icon
						icon={isMenuOpen ? HideIcon : ShowIcon}
						size={"sm"}
					/>
				}
				onClick={() => setIsMenuOpen((prev) => !prev)}
				{...props}
			>
				<Markdown>{listingTransactionMessage.message}</Markdown>
			</EventBadge>

			<MessageMenu
				locale={props.locale}
				side={props.side}
				type={props.type}
				listingTransactionMessage={listingTransactionMessage}
				isOpen={isMenuOpen && props.isCurrent && !props.isClosed}
				onClose={() => setIsMenuOpen(false)}
				components={components}
			/>
		</>
	);
};
