import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import type { tUpload } from "@zbav-se.me/sdk/api/user";
import { CloseButton } from "@zbav-se.me/ui/button";
import type { FC } from "react";
import { GalleryPreview } from "~/app/@common/gallery/ui/GalleryPreview";

export namespace GallerySheet {
	export interface Props extends BottomSheet.Props {
		uploads: tUpload[];
	}
}

export const GallerySheet: FC<GallerySheet.Props> = ({ uploads, ...props }) => {
	return (
		<BottomSheet
			data-ui={"GalleryButton[BottomSheet]"}
			detent={"full"}
			header={({ close }) => ({
				title: "Gallery (title)",
				right: <CloseButton onClick={close} />,
			})}
			contentProps={{
				disableScroll: true,
			}}
			{...props}
		>
			<GalleryPreview uploads={uploads} />
		</BottomSheet>
	);
};
