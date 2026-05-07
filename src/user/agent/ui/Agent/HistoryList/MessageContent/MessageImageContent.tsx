import { type FC, useState } from "react";
import { Container } from "@/lib/client/container";
import { Group } from "@/lib/client/group";
import { GalleryPreviewSheet } from "~/common/gallery/ui/GalleryPreviewSheet";
import { HeroImage } from "~/common/ui/img";

export namespace MessageImageContent {
	export interface Props extends Group.Props {
		groupId?: string;
		image: unknown;
	}
}

export const MessageImageContent: FC<MessageImageContent.Props> = ({
	groupId,
	image,
	...props
}) => {
	const [isPreviewOpen, setIsPreviewOpen] = useState(false);
	const src = getImageSrc(image);
	if (!src) {
		return null;
	}

	return (
		<Group
			data-ui={"MessageImageContent"}
			data-id={groupId}
			data-ui-tone="neutral"
			data-ui-theme="light"
			data-ui-background="alt"
			data-ui-inner="default"
			{...props}
		>
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
				urls={[
					src,
				]}
				isOpen={isPreviewOpen}
				onClose={() => setIsPreviewOpen(false)}
			/>
		</Group>
	);
};

// =================================================================================================

function getImageSrc(image: unknown) {
	if (typeof image === "string") {
		return image;
	}

	return undefined;
}
