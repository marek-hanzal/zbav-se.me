import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Button } from "@use-pico/client/ui/button";
import { translator } from "@use-pico/common/translator";
import { CloseButton } from "@zbav-se.me/ui/button";
import { BuyerIcon } from "@zbav-se.me/ui/icon";
import { type FC, useState } from "react";
import { BuyerInfoSuspense } from "~/app/@seller-session/transaction/ui/BuyerInfoSuspense";

export namespace BuyerInfoButton {
	export interface Props extends Button.Props {
		transactionId: string;
	}
}

export const BuyerInfoButton: FC<BuyerInfoButton.Props> = ({ transactionId, ...props }) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<Button
				data-ui="BuyerInfoButton[Button]"
				iconEnabled={BuyerIcon}
				label={translator.text("Buyer info (button)")}
				onClick={() => {
					setIsOpen(true);
				}}
				{...props}
			/>

			<BottomSheet
				data-ui="BuyerInfoButton[BottomSheet]"
				isOpen={isOpen}
				onClose={() => {
					setIsOpen(false);
				}}
				header={({ close }) => ({
					title: translator.text("Buyer info (title)"),
					right: <CloseButton onClick={close} />,
				})}
			>
				<BuyerInfoSuspense
					transactionId={transactionId}
					ui={{
						inner: "default",
					}}
				/>
			</BottomSheet>
		</>
	);
};
