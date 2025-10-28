import { createFileRoute } from "@tanstack/react-router";
import { Container, Typo } from "@use-pico/client";

export const Route = createFileRoute("/cs/tos")({
	component() {
		return (
			<Container
				layout={"vertical-content"}
				overflow={"vertical"}
				tone={"secondary"}
				theme={"light"}
			>
				<Typo
					label={"Podmínky použití"}
					display={"block"}
					size={"2xl"}
					text={"center"}
				/>

				<Typo
					label={"zbav-se.me"}
					display={"block"}
					size={"lg"}
					text={"center"}
					font={"bold"}
				/>
			</Container>
		);
	},
});
