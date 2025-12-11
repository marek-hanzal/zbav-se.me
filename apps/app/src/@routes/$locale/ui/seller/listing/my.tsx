import { createFileRoute } from "@tanstack/react-router";
import { TitleContainer } from "@zbav-se.me/ui/container";

export const Route = createFileRoute("/$locale/ui/seller/listing/my")({
	component() {
		return (
			<TitleContainer textTitle={"My listings (title)"}>some other day, bro</TitleContainer>
		);
	},
});
