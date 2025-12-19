import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Button } from "@use-pico/client/ui/button";
import { translator } from "@use-pico/common/translator";
import { CloseButton } from "@zbav-se.me/ui/button";
import { SellerIcon } from "@zbav-se.me/ui/icon";
import { type FC, useState } from "react";
import { SellerInfo } from "~/app/transaction/ui/seller/SellerInfo";
import { useSide } from "~/app/user/useSide";

export namespace SellerInfoButton {
	export interface Props extends Button.Props {
		transactionId: string;
	}
}

export const SellerInfoButton: FC<SellerInfoButton.Props> = ({ transactionId, ...props }) => {
	const side = useSide();
	const [isOpen, setIsOpen] = useState(false);

	if (side === "seller") {
		return null;
	}

	return (
		<>
			<Button
				data-ui="SellerInfoButton[Button]"
				iconEnabled={SellerIcon}
				label={"Seller info (button)"}
				onClick={() => {
					setIsOpen(true);
				}}
				{...props}
			/>

			<BottomSheet
				data-ui="SellerInfoButton[BottomSheet]"
				isOpen={isOpen}
				onClose={() => {
					setIsOpen(false);
				}}
				header={({ close }) => ({
					title: translator.text("Seller info (title)"),
					right: <CloseButton onClick={close} />,
				})}
			>
				<SellerInfo
					transactionId={transactionId}
					ui={{
						inner: "default",
					}}
				/>
			</BottomSheet>
		</>
	);
};
