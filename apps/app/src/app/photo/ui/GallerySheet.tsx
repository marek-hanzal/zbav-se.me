import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Container } from "@use-pico/client/ui/container";
import { Fade } from "@use-pico/client/ui/fade";
import type { tUpload } from "@zbav-se.me/sdk/api/user";
import { CloseButton } from "@zbav-se.me/ui/button";
import { HeroImage } from "@zbav-se.me/ui/img";
import { type FC, useRef } from "react";

export namespace GallerySheet {
	export interface Props extends BottomSheet.Props {
		uploads: tUpload[];
	}
}

export const GallerySheet: FC<GallerySheet.Props> = ({ uploads, ...props }) => {
	const containerRef = useRef<HTMLDivElement>(null);

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
			<Container
				data-ui={"GalleryButton-[Container.wrapper]"}
				ui={{
					position: "relative",
					height: "full",
					inner: "default",
					round: "default",
				}}
			>
				<Fade scrollableRef={containerRef} />

				<Container
					ref={containerRef}
					data-ui={"GalleryButton-[Container.content]"}
					ui={{
						layout: "vertical-full",
						height: "full",
						snap: "vertical",
						snapAlign: "center",
						gap: "default",
					}}
				>
					{uploads.map((upload) => {
						return (
							<HeroImage
								key={upload.id}
								src={upload.url}
								alt={"Gallery image"}
								ui={{
									height: "full",
									round: "default",
								}}
							/>
						);
					})}
				</Container>
			</Container>
		</BottomSheet>
	);
};
