import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import type { tUpload } from "@zbav-se.me/sdk/api/user";
import { CloseButton } from "@zbav-se.me/ui/button";
import type { FC } from "react";
import { GalleryPreview } from "~/app/@common/gallery/ui/GalleryPreview";

export namespace GalleryPreviewSheet {
	export interface Props extends BottomSheet.Props {
		uploads: tUpload[];
	}
}

/**
 * Opens uploaded photos in a full-height bottom sheet so users can review gallery content in detail.
 * Use it after photo selection when users need a dedicated preview step before confirming changes.
 *
 * @see apps/app/src/app//draft/ui/DraftEditor/patch/GalleryPatch.tsx
 */
export const GalleryPreviewSheet: FC<GalleryPreviewSheet.Props> = ({ uploads, ...props }) => {
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
