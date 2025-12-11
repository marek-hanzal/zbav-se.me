import { createFileRoute, useLoaderData, useParams } from "@tanstack/react-router";
import { UserIcon } from "@use-pico/client/icon";
import { Status } from "@use-pico/client/ui/status";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { SignOutButton } from "~/app/auth/ui/SignOutButton";

export const Route = createFileRoute("/$locale/home/user")({
	component() {
		const { user } = useLoaderData({
			from: "/$locale",
		});
		const { locale } = useParams({
			from: "/$locale",
		});

		return (
			<TitleContainer
				data-ui={"User"}
				textTitle={"User profile (title)"}
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
