import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Container } from "@use-pico/client/ui/container";
import { Fade } from "@use-pico/client/ui/fade";
import type { tUpload } from "@zbav-se.me/sdk/api/user";
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
			ui={"GalleryButton-bottom-sheet"}
			detent={"full"}
			header={{
				close: true,
				title: "Gallery (title)",
			}}
			contentProps={{
				disableScroll: true,
			}}
			{...props}
		>
			<Container
				ui={"GalleryButton-root"}
				position={"relative"}
				height={"fit"}
				tone={"unset"}
				theme={"unset"}
			>
				<Fade
					scrollableRef={containerRef}
					theme={"dark"}
				/>

				<Container
					ref={containerRef}
					ui={"GalleryButton-container"}
					layout={"vertical-full"}
					gap={"sm"}
					height={"content"}
					snap={"vertical-center"}
					square={"md"}
					tone={"unset"}
					theme={"unset"}
				>
					{uploads.map((upload) => {
						return (
							<HeroImage
								key={upload.id}
								src={upload.url}
								alt={"Gallery image"}
								round
							/>
						);
					})}
				</Container>
			</Container>
		</BottomSheet>
	);
};
