import { Button } from "@use-pico/client/ui/button";
import type { tListingTransactionLog } from "@zbav-se.me/sdk/api/user";
import { BuyerIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";

export namespace BuyerInfoButton {
	export interface Props extends Button.Props {
		log: tListingTransactionLog;
	}
}

export const BuyerInfoButton: FC<BuyerInfoButton.Props> = ({ log, ...props }) => {
	return (
		<Button
			iconEnabled={BuyerIcon}
			size={"xl"}
			full
			label={"Buyer info (label)"}
			{...props}
		/>
	);
};
