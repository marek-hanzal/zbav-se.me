import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { translator } from "@use-pico/common/translator";
import { CloseButton } from "@zbav-se.me/ui/button";
import type { FC } from "react";
import { GalleryPreview } from "~/client/@common/gallery/ui/GalleryPreview";
import type { UploadSchema } from "~/client/@user/upload/server/schema/UploadSchema";

export namespace GalleryPreviewSheet {
	export interface Props extends BottomSheet.Props {
		uploads: UploadSchema.Type[];
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
			data-ui={"GalleryPreviewSheet"}
			detent={"default"}
			header={({ close }) => ({
				title: translator.text("Gallery (title)"),
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
