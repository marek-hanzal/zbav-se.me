import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { uiButton } from "@use-pico/client/ui/button";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { TitleContainer } from "@zbav-se.me/ui/container";

export const Route = createFileRoute("/$locale/seller/shop")({
	component() {
		const { locale } = Route.useParams();

		return (
			<TitleContainer
				textTitle={"Seller - shop (title)"}
				left={
					<LinkTo
						{...uiButton({
							ui: {
								round: "full",
								square: "default",
								opacity: "subtle",
							},
							className: [],
						})}
						icon={ArrowLeftIcon}
						to={"/$locale/seller"}
						params={{
							locale,
						}}
					/>
				}
			>
				Seller - shop
			</TitleContainer>
		);
	},
});
