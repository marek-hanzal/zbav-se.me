import { useLocale } from "@use-pico/client/hook";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Tx } from "@use-pico/client/ui/tx";
import type { tInbox, zInboxSellerMessagePayload } from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";

export namespace InboxSellerMessageItem {
	export interface Props extends Container.Props {
		item: tInbox;
		payload: zInboxSellerMessagePayload;
	}
}

export const InboxSellerMessageItem: FC<InboxSellerMessageItem.Props> = ({
	item,
	payload,
	...props
}) => {
	const locale = useLocale();

	return (
		<Container
			data-ui="InboxSellerMessageItem[Container]"
			ui={{
				border: true,
				round: "md",
				inner: "default",
				flow: "vertical",
				gap: "xs",
			}}
			{...props}
		>
			<Tx label="Inbox seller message (title)" />
			<Tx label={`#${payload.transactionId}`} />
			<LinkTo
				to="/$locale/buyer/message/list"
				params={{
					locale,
				}}
				ui={{
					size: "xs",
					border: true,
					round: "sm",
				}}
			>
				<Tx label="Open message thread (button)" />
			</LinkTo>
			<Tx
				label={
					item.priority === "high" ? "High priority (label)" : "Common priority (label)"
				}
			/>
		</Container>
	);
};
