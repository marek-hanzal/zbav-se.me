import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Container } from "@use-pico/client/ui/container";
import type { tListingTransactionMessage, tUserSideEnum } from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";
import { MessageButton } from "../../../listing-transaction/button/MessageButton";
import type { useSideSwitch } from "../../../listing-transaction/useSideSwitch";
import type { TransactionLogList } from "../../TransactionLogList";

export namespace MessageMenu {
	export interface Props extends BottomSheet.Props {
		locale: string;
		side: tUserSideEnum;
		type: useSideSwitch.Type;
		listingTransactionMessage: tListingTransactionMessage;
		components: TransactionLogList.Components;
	}
}

export const MessageMenu: FC<MessageMenu.Props> = ({
	locale,
	side,
	type,
	listingTransactionMessage,
	components,
	...props
}) => {
	return (
		<BottomSheet
			detent={"content"}
			{...props}
		>
			<Container
				layout={"vertical-flex"}
				gap={"md"}
				square={"md"}
			>
				<MessageButton
					listingTransactionId={listingTransactionMessage.listingTransactionId}
				/>
			</Container>
		</BottomSheet>
	);
};
