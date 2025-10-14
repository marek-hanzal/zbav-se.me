import { Container } from "@use-pico/client";
import type { FC } from "react";
import { Sheet } from "~/app/sheet/Sheet";
import { Markdown } from "~/app/ui/Markdown";

export namespace AboutSheet {
	export interface Props {
		markdown: string;
	}
}

export const AboutSheet: FC<AboutSheet.Props> = ({ markdown }) => {
	return (
		<Sheet
			tweak={{
				slot: {
					root: {
						class: [
							"p-4",
							"pb-12",
						],
					},
				},
			}}
		>
			<Container
				layout={"vertical-full"}
				overflow={"vertical"}
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
