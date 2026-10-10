import type { FC } from "react";
import { CloseButton } from "~/application-ui/ui/button.exports";
import { GalleryPreview } from "~/gallery/ui/GalleryPreview";
import { useTranslator } from "~/translation/hook/useTranslator";
import { BottomSheet } from "~/ui/ui/BottomSheet";

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
	const translator = useTranslator();
	return (
		<BottomSheet
			data-ui={"GalleryPreviewSheet"}
			detent={"default"}
			headerFn={({ closeFn }) => ({
				title: translator.textFn("Gallery (title)"),
				right: <CloseButton onClick={closeFn} />,
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
