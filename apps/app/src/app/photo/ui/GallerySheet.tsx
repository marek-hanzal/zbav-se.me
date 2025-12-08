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
			data-ui={"GalleryButton-BottomSheet"}
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
				data-ui={"GalleryButton-Container-wrapper"}
				position={"relative"}
				height={"full"}
			>
				<Fade
					scrollableRef={containerRef}
					theme={"dark"}
				/>

				<Container
					ref={containerRef}
					data-ui={"GalleryButton-Container-content"}
					layout={"vertical-full"}
					gap={"sm"}
					height={"content"}
					snap={"vertical"}
					snapAlign={"center"}
					square={"md"}
				>
					{uploads.map((upload) => {
						return (
							<HeroImage
								key={upload.id}
								src={upload.url}
								alt={"Gallery image"}
								round={"default"}
							/>
						);
					})}
				</Container>
			</Container>
		</BottomSheet>
	);
};
