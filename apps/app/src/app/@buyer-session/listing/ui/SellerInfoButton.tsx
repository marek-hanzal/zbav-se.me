import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Button } from "@use-pico/client/ui/button";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import { CloseButton } from "@zbav-se.me/ui/button";
import { SellerIcon } from "@zbav-se.me/ui/icon";
import { type FC, useState } from "react";
import { SellerInfo } from "./SellerInfo";

export namespace SellerInfoButton {
	export interface Props extends Button.Props {
		listingId: string;
	}
}

/**
 * Renders an action button that opens seller information in a bottom sheet tied to a specific listing.
 * Use it in listing cards or detail headers where buyer users need quick access to seller details.
 *
 * @see apps/app/src/app/@buyer-session/listing/ui/SellerInfo/SellerInfo.tsx
 */
export const SellerInfoButton: FC<SellerInfoButton.Props> = ({ listingId, ...props }) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<Button
				data-ui="SellerInfoButton[Button]"
				iconEnabled={SellerIcon}
				onClick={() => {
					setIsOpen(true);
				}}
				{...props}
			>
				<Tx label="Seller info (button)" />
			</Button>

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
