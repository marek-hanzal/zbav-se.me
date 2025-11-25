import { Button } from "@use-pico/client/ui/button";
import type { tListingTransactionLog } from "@zbav-se.me/sdk/api/user";
import { SellerIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";

export namespace SellerInfoButton {
	export interface Props extends Button.Props {
		log: tListingTransactionLog;
	}
}

export const SellerInfoButton: FC<SellerInfoButton.Props> = ({ log, ...props }) => {
	return (
		<Button
			iconEnabled={SellerIcon}
			size={"xl"}
			full
			label={"Seller info (label)"}
			{...props}
		/>
	);
};
