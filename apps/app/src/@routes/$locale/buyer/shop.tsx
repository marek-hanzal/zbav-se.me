import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { asButton } from "@use-pico/theme/button";
import { TitleContainer } from "@zbav-se.me/ui/container";

export const Route = createFileRoute("/$locale/buyer/shop")({
	component() {
		const { locale } = Route.useParams();

		return (
			<TitleContainer
				textTitle={"Buyer - shop (title)"}
				left={
					<LinkTo
						{...asButton({
							round: "full",
							square: "default",
						})}
						icon={ArrowLeftIcon}
						to={"/$locale/buyer"}
						params={{
							locale,
						}}
					/>
				}
			>
				Buyer - shop
			</TitleContainer>
		);
	},
});
