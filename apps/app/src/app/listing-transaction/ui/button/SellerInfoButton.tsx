import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Button } from "@use-pico/client/ui/button";
import type { tListingTransactionLog } from "@zbav-se.me/sdk/api/user";
import { SellerIcon } from "@zbav-se.me/ui/icon";
import { type FC, useState } from "react";
import { SellerInfoContainer } from "../SellerInfoContainer";

export namespace SellerInfoButton {
	export interface Props extends Button.Props {
		locale: string;
		log: tListingTransactionLog;
		modalRootId?: string;
	}
}

export const SellerInfoButton: FC<SellerInfoButton.Props> = ({
	locale,
	log,
	modalRootId,
	...props
}) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<Button
				iconEnabled={SellerIcon}
				tone={"primary"}
				theme={"light"}
				size={"xl"}
				label={"Seller info (label)"}
				onClick={() => setIsOpen(true)}
				justify={"start"}
				{...props}
			/>

			<BottomSheet
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				detent={"default"}
				modalEffectRootId={modalRootId}
				header={{
					close: true,
					title: "Seller info (title)",
				}}
			>
				<SellerInfoContainer
					locale={locale}
					listingTransactionId={log.listingTransactionId}
				/>
			</BottomSheet>
		</>
	);
};
