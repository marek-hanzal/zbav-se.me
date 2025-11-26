import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Button } from "@use-pico/client/ui/button";
import type { tListingTransactionLog } from "@zbav-se.me/sdk/api/user";
import { BuyerIcon } from "@zbav-se.me/ui/icon";
import { type FC, useState } from "react";
import { BuyerInfoContainer } from "../BuyerInfoContainer";

export namespace BuyerInfoButton {
	export interface Props extends Button.Props {
		locale: string;
		log: tListingTransactionLog;
	}
}

export const BuyerInfoButton: FC<BuyerInfoButton.Props> = ({ locale, log, ...props }) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<Button
				iconEnabled={BuyerIcon}
				size={"xl"}
				full
				label={"Buyer info (label)"}
				onClick={() => setIsOpen(true)}
				{...props}
			/>

			<BottomSheet
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
			>
				<BuyerInfoContainer
					locale={locale}
					listingTransactionId={log.listingTransactionId}
				/>
			</BottomSheet>
		</>
	);
};
