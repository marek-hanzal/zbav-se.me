import { createFileRoute, useLoaderData, useParams } from "@tanstack/react-router";
import { ArrowLeftIcon, UserIcon } from "@use-pico/client/icon";
import { uiButton } from "@use-pico/client/ui/button";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { SignOutButton } from "~/app/auth/ui/SignOutButton";

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
				textTitle={"User profile (title)"}
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
				ui={{
					gap: "default",
				}}
			>
				<Status
					icon={UserIcon}
					textTitle={user.email}
					textMessage={user.name}
					action={<SignOutButton locale={locale} />}
				/>
			</TitleContainer>
		);
	},
});
