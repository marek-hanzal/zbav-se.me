import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { uiBackButton } from "@zbav-se.me/ui/ui";

export const Route = createFileRoute("/$locale/seller/listing/my")({
	component() {
		const { locale } = Route.useParams();

		return (
			<TitleContainer
				textTitle={"My listings (title)"}
				left={
					<LinkTo
						{...uiBackButton({
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
				some other day, bro
			</TitleContainer>
		);
	},
});
