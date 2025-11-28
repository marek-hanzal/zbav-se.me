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
				tone={"link"}
				theme={"light"}
				size={"lg"}
				round={"full"}
				onClick={() => setIsOpen(true)}
				{...props}
			/>

			<BottomSheet
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				detent={"default"}
				modalEffectRootId={modalRootId}
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
