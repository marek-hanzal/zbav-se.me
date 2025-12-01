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
		modalRootId?: string;
	}
}

export const BuyerInfoButton: FC<BuyerInfoButton.Props> = ({
	locale,
	log,
	modalRootId,
	...props
}) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<Button
				iconEnabled={BuyerIcon}
				iconPosition={"right"}
				tone={"primary"}
				theme={"light"}
				size={"xl"}
				menu
				label={"Buyer info (label)"}
				onClick={() => setIsOpen(true)}
				{...props}
			/>

			<BottomSheet
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				detent={"default"}
				modalEffectRootId={modalRootId}
				noClose
			>
				<BuyerInfoContainer
					locale={locale}
					listingTransactionId={log.listingTransactionId}
					square={"md"}
				/>
			</BottomSheet>
		</>
	);
};
