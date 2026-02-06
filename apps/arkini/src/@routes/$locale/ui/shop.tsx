import { createFileRoute } from "@tanstack/react-router";
import { TitleContainer } from "@zbav-se.me/ui/container";

export const Route = createFileRoute("/$locale/ui/shop")({
	component() {
		return <TitleContainer textTitle={"Buyer - shop (title)"}>Shop</TitleContainer>;
	},
});
