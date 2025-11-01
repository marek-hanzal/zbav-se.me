import { Container } from "@use-pico/client/ui/container";
import { Fade, Sheet } from "@zbav-se.me/ui";
import { type FC, useRef } from "react";
import { Markdown } from "~/app/ui/Markdown";

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
				tone={"unset"}
				theme={"unset"}
			>
				<div className={"reveal"}>
					<Markdown>{markdown}</Markdown>
				</div>
			</Container>
		</Sheet>
	);
};
