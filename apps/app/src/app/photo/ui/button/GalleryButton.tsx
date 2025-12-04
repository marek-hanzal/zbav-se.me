import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { Fade } from "@use-pico/client/ui/fade";
import type { tUpload } from "@zbav-se.me/sdk/api/user";
import { GalleryIcon } from "@zbav-se.me/ui/icon";
import { HeroImage } from "@zbav-se.me/ui/img";
import { type FC, useRef, useState } from "react";

export namespace GalleryButton {
	export interface Props extends Button.Props {
		uploads: tUpload[];
	}
}

export const GalleryButton: FC<GalleryButton.Props> = ({ uploads, ...props }) => {
	const [isOpen, setIsOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	return (
		<>
			<Button
				iconEnabled={GalleryIcon}
				tone={"primary"}
				onClick={() => setIsOpen((prev) => !prev)}
				label={"Open gallery (button)"}
				menu
				size={"xl"}
				{...props}
			/>

			<BottomSheet
				ui={"GalleryButton-bottom-sheet"}
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				detent={"full"}
				header={{
					close: true,
					title: "Gallery (title)",
				}}
				contentProps={{
					disableScroll: true,
				}}
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
		</>
	);
};
