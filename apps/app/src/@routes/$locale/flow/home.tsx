import { createFileRoute } from "@tanstack/react-router";
import { FlowContainer } from "@zbav-se.me/ui/container";
import { HomeMenu } from "~/app/@user/home/HomeMenu";

export const Route = createFileRoute("/$locale/flow/home")({
	component() {
		return (
			<FlowContainer>
				<HomeMenu />
			</FlowContainer>
		);
	},
});
