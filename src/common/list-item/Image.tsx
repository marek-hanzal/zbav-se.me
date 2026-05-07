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
			data-ui-round="md"
		>
			{src ? (
				<HeroImage
					data-ui={"DraftItem-[HeroImage]"}
					src={src}
					alt={`Hero image for draft`}
					visible
					data-ui-width="full"
					data-ui-height="full"
				/>
			) : (
				<Container
					data-ui-tone="subtle"
					data-ui-theme="light"
					data-ui-width="full"
					data-ui-height="full"
					data-ui-flow="horizontal"
					data-ui-items="center"
					data-ui-justify="center"
					data-ui-background="default"
				>
					<Icon
						icon={"icon-[solar--question-square-linear]"}
						data-ui-text="2xl"
						data-ui-color="text"
						data-ui-opacity="2"
					/>
				</Container>
			)}
		</Container>
	);
};
