import { ShowIcon } from "@use-pico/client/icon";
import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Button } from "@use-pico/client/ui/button";
import type { zListing } from "@zbav-se.me/sdk/api/user";
import { type FC, useState } from "react";
import { ListingDetailContainer } from "./ListingDetailContainer";

export namespace ListingDetailButton {
	export interface Props extends Button.Props {
		locale: string;
		detailSheetId: string;
		listing: zListing;
	}
}

export const ListingDetailButton: FC<ListingDetailButton.Props> = ({
	locale,
	detailSheetId,
	listing,
	children,
	...props
}) => {
	const [detail, setDetail] = useState(false);

	return (
		<>
			<Button
				iconEnabled={ShowIcon}
				tone={"primary"}
				theme={"light"}
				size={"xl"}
				round={"full"}
				onClick={() => setDetail(true)}
				border={false}
				{...props}
			/>

			<BottomSheet
				id={detailSheetId}
				isOpen={detail}
				onClose={() => setDetail(false)}
				detent={"full"}
			>
				<ListingDetailContainer
					parentSheetId={detailSheetId}
					locale={locale}
					listing={listing}
					withScore
					square={"md"}
				>
					{children}
				</ListingDetailContainer>
			</BottomSheet>
		</>
	);
};
