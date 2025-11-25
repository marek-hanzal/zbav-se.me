import { ArrowRightIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import { Modal } from "@use-pico/client/ui/modal";
import type { zListing } from "@zbav-se.me/sdk/api/user";
import { ModalContainer } from "@zbav-se.me/ui/container";
import type { FC } from "react";
import { ListingDetailContainer } from "./ListingDetailContainer";

export namespace ListingDetailButton {
	export interface Props extends Button.Props {
		locale: string;
		listing: zListing;
	}
}

export const ListingDetailButton: FC<ListingDetailButton.Props> = ({
	locale,
	listing,
	...props
}) => {
	return (
		<Modal
			target={
				<Button
					iconEnabled={ArrowRightIcon}
					tone={"primary"}
					theme={"light"}
					size={"xl"}
					round={"full"}
					{...props}
				/>
			}
			size={"full"}
		>
			{({ close }) => {
				return (
					<ModalContainer
						textTitle={"Listing detail (title)"}
						close={close}
					>
						<ListingDetailContainer
							listing={listing}
							locale={locale}
							query={undefined}
							withScore
							renderScoreBadgeFn={() => {
								return "nope";
							}}
							renderSellerBadgeFn={() => {
								return "nope";
							}}
							_suspense={"I know"}
						/>
					</ModalContainer>
				);
			}}
		</Modal>
	);
};
