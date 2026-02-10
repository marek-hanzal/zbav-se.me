import { createFileRoute } from "@tanstack/react-router";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { HomeMenu } from "~/app/@user/home/HomeMenu";

export const Route = createFileRoute("/$locale/flow/home")({
	component() {
		return (
			<TitleContainer textTitle="zbav-se.me">
				<HomeMenu />
			</TitleContainer>
		);
	},
});
