import { createLazyFileRoute } from "@tanstack/react-router";
import { TitleContainer } from "@zbav-se.me/ui/container";

export const Route = createLazyFileRoute("/$locale/ui/shop")({
	component() {
		return <TitleContainer textTitle={"Buyer - shop (title)"}>Shop</TitleContainer>;
	},
});
