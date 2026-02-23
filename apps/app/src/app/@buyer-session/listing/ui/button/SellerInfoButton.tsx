import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Button } from "@use-pico/client/ui/button";
import { translator } from "@use-pico/common/translator";
import { CloseButton } from "@zbav-se.me/ui/button";
import { SellerIcon } from "@zbav-se.me/ui/icon";
import { type FC, useState } from "react";
import { SellerInfo } from "~/app/@buyer-session/listing/ui/SellerInfo";

export namespace SellerInfoButton {
	export interface Props extends Button.Props {
		listingId: string;
	}
}

export const SellerInfoButton: FC<SellerInfoButton.Props> = ({ listingId, ...props }) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<Button
				data-ui="SellerInfoButton[Button]"
				iconEnabled={SellerIcon}
				label={translator.text("Seller info (button)")}
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
					listingId={listingId}
					ui={{
						inner: "default",
					}}
				/>
			</BottomSheet>
		</>
	);
};
