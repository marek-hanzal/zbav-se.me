import { type FC, useState } from "react";
import { HeroImage } from "~/application-ui/ui/img.exports";
import { GalleryPreviewSheet } from "~/gallery/ui/GalleryPreviewSheet";
import { Container } from "~/ui/ui/Container";
import { Group } from "~/ui/ui/Group";

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
	const [isPreviewOpen, setIsPreviewOpenFn] = useState(false);
	const src = getImageSrcFn(image);
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
					onClick={() => setIsPreviewOpenFn(true)}
				/>
			</Container>

			<GalleryPreviewSheet
				urls={[
					src,
				]}
				isOpen={isPreviewOpen}
				onClose={() => setIsPreviewOpenFn(false)}
			/>
		</Group>
	);
};

// =================================================================================================

function getImageSrcFn(image: unknown) {
	if (typeof image === "string") {
		return image;
	}

	return undefined;
}
