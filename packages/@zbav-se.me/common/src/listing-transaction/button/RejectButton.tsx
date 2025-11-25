import { Button } from "@use-pico/client/ui/button";
import type { tListingTransactionLog } from "@zbav-se.me/sdk/api/user";
import { CancelIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";

export namespace RejectButton {
	export interface Props extends Button.Props {
		log: tListingTransactionLog;
	}
}

export const RejectButton: FC<RejectButton.Props> = ({ log, ...props }) => {
    const tt = withTraLog

	return (
		<Button
			iconEnabled={CancelIcon}
			size={"xl"}
			full
			label={"Reject transaction (label)"}
			{...props}
		/>
	);
};
