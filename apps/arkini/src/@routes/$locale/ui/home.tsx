import { createFileRoute } from "@tanstack/react-router";
import { Container } from "@use-pico/client/ui/container";
import { TitleContainer } from "@zbav-se.me/ui/container";

export const Route = createFileRoute("/$locale/ui/home")({
	component() {
		return (
			<TitleContainer textTitle={"Arkini"}>
				<Container>Hello there!</Container>
			</TitleContainer>
		);
	},
});
