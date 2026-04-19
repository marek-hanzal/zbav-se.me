import { type FC, useState } from "react";
import { Container } from "@/lib/client/container";
import { GalleryPreviewSheet } from "~/common/gallery/ui/GalleryPreviewSheet";
import { HeroImage } from "~/common/ui/img";
import type { UploadSchema } from "~/user/upload/server/schema/UploadSchema";
import { getImageSrc, type ImageReference } from "./getImageSrc";

export namespace MessageImageContent {
	export interface Props {
		image: ImageReference;
	}
}

export const MessageImageContent: FC<MessageImageContent.Props> = ({ image }) => {
	const [isPreviewOpen, setIsPreviewOpen] = useState(false);
	const src = getImageSrc(image);

	if (!src) {
		return null;
	}

	const uploads: UploadSchema.Type[] = [
		{
			id: src,
			url: src,
		},
	];

	return (
		<>
			<Container
				data-ui={"MessageContent-[Image]"}
				data-ui-width="full"
				data-ui-position="relative"
				className={[
					"h-72",
					"max-h-[480px]",
					"min-h-40",
				]}
			>
				<HeroImage
					src={src}
					alt=""
					data-ui={"MessageContent-[HeroImage]"}
					data-ui-round="default"
					className="cursor-pointer bg-black/5"
					onClick={() => setIsPreviewOpen(true)}
				/>
			</Container>

			<GalleryPreviewSheet
				uploads={uploads}
				isOpen={isPreviewOpen}
				onClose={() => setIsPreviewOpen(false)}
			/>
		</>
	);
};
