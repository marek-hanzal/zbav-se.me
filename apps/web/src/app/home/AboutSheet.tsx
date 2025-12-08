import { Container } from "@use-pico/client/ui/container";
import { Fade } from "@use-pico/client/ui/fade";
import { Markdown } from "@use-pico/client/ui/markdown";
import { type FC, useRef } from "react";

export namespace AboutSheet {
	export interface Props {
		markdown: string;
	}
}

export const AboutSheet: FC<AboutSheet.Props> = ({ markdown }) => {
	const scrollerRef = useRef<HTMLDivElement>(null);

	return (
		<Container>
			<Fade scrollableRef={scrollerRef} />

			<Container
				ref={scrollerRef}
				layout={"vertical-full"}
				scroll={"vertical"}
			>
				<div className={"reveal"}>
					<Markdown>{markdown}</Markdown>
				</div>
			</Container>
		</Container>
	);
};
