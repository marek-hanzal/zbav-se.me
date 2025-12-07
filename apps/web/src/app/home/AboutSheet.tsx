import { Container } from "@use-pico/client/ui/container";
import { Markdown } from "@use-pico/client/ui/markdown";
import { Fade } from "@zbav-se.me/ui/fade";
import { Sheet } from "@zbav-se.me/ui/sheet";
import { type FC, useRef } from "react";

export namespace AboutSheet {
	export interface Props {
		markdown: string;
	}
}

export const AboutSheet: FC<AboutSheet.Props> = ({ markdown }) => {
	const scrollerRef = useRef<HTMLDivElement>(null);

	return (
		<Sheet
			tweak={{
				slot: {
					root: {
						class: [
							"p-4",
						],
					},
				},
			}}
		>
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
		</Sheet>
	);
};
