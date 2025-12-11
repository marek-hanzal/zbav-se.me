import { createFileRoute } from "@tanstack/react-router";
import { Container } from "@use-pico/client/ui/container";
import { TitleContainer } from "@zbav-se.me/ui/container";

export const Route = createFileRoute("/$locale/home/")({
	component() {
		return (
			<TitleContainer textTitle={"zbav-se.me"}>
				<Container>Kunda</Container>
			</TitleContainer>
		);
	},
});
