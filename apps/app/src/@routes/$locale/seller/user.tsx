import { createFileRoute, useLoaderData, useParams } from "@tanstack/react-router";
import { ArrowLeftIcon, UserIcon } from "@use-pico/client/icon";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { uiBackButton } from "@zbav-se.me/ui/ui";
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
