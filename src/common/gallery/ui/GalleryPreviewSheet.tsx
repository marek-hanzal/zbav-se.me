import type { FC } from "react";
import { BottomSheet } from "@/lib/client/bottom-sheet";
import { translator } from "@/lib/common/translation";
import { GalleryPreview } from "~/common/gallery/ui/GalleryPreview";
import { CloseButton } from "~/common/ui/button";

export namespace GalleryPreviewSheet {
	export interface Props extends BottomSheet.Props {
		urls: string[];
	}
}

/**
 * Opens uploaded photos in a full-height bottom sheet so users can review gallery content in detail.
 * Use it after photo selection when users need a dedicated preview step before confirming changes.
 *
 * @see src/draft/ui/DraftEditor/patch/GalleryPatch.tsx
 */
export const GalleryPreviewSheet: FC<GalleryPreviewSheet.Props> = ({ urls, ...props }) => {
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
			<GalleryPreview
				urls={urls}
				onClick={() => {
					props.onClose();
				}}
			/>
		</BottomSheet>
	);
};
