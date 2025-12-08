import { createFileRoute, useLoaderData, useParams } from "@tanstack/react-router";
import { ArrowLeftIcon, UserIcon } from "@use-pico/client/icon";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import { asButton } from "@use-pico/theme/button";
import { TitleContainer } from "@zbav-se.me/ui/container";

export const Route = createFileRoute("/$locale/seller/user")({
	component() {
		const { user } = useLoaderData({
			from: "/$locale",
		});
		const { locale } = useParams({
			from: "/$locale",
		});

		return (
			<TitleContainer
				data-ui="User-root"
				gap={"md"}
				textTitle={"User profile (title)"}
				left={
					<LinkTo
						{...asButton({
							round: "full",
							square: "default",
						})}
						icon={ArrowLeftIcon}
						to={"/$locale/seller"}
						params={{
							locale,
						}}
					/>
				}
			>
				<Status
					icon={UserIcon}
					textTitle={user.email}
					textMessage={user.name}
				/>
			</TitleContainer>
		);
	},
});
