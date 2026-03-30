import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { Icon } from "@/lib/client/icon";
import { HeroImage } from "~/common/ui/img";

export namespace Image {
	export interface Props {
		src?: string;
	}
}

export const Image: FC<Image.Props> = ({ src }) => {
	return (
		<Container
			className={"aspect-square h-full shrink-0 overflow-hidden"}
			ui={{
				round: "md",
			}}
		>
			{src ? (
				<HeroImage
					data-ui={"DraftItem-[HeroImage]"}
					src={src}
					alt={`Hero image for draft`}
					visible
					ui={{
						width: "full",
						height: "full",
					}}
				/>
			) : (
				<Container
					ui={{
						tone: "subtle",
						theme: "light",
						width: "full",
						height: "full",
						flow: "horizontal",
						items: "center",
						justify: "center",
						background: "default",
					}}
				>
					<Icon
						icon={"icon-[solar--question-square-linear]"}
						ui={{
							text: "2xl",
							color: "text",
							opacity: "2",
						}}
					/>
				</Container>
			)}
		</Container>
	);
};
