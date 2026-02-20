import { createFileRoute } from "@tanstack/react-router";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { HomeMenuButton } from "~/app/@user/home/HomeMenuButton";

export const Route = createFileRoute("/$locale/flow/shop")({
	component() {
		return (
			<TitleContainer
				textTitle={"Shop (title)"}
				right={<HomeMenuButton />}
			>
				Shop
			</TitleContainer>
		);
	},
});
