import { createFileRoute } from "@tanstack/react-router";
import { UserIcon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
import { Status } from "@use-pico/client/ui/status";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { SignOutButton } from "~/app/auth/ui/SignOutButton";
import { useUser } from "~/app/user/useUser";

export const Route = createFileRoute("/$locale/ui/user")({
	component() {
		const user = useUser();

		return (
			<TitleContainer
				data-ui={"User"}
				textTitle={"User profile (title)"}
				ui={{
					layout: "vertical-header-content",
				}}
			>
				<Container
					ui={{
						layout: "vertical-centered",
						height: "full",
					}}
				>
					<Status
						icon={UserIcon}
						textTitle={user.email}
						textMessage={user.name}
						action={<SignOutButton />}
						ui={{
							tone: "brand",
							theme: "light",
							color: "lead",
							text: "3xl",
						}}
					/>
				</Container>
			</TitleContainer>
		);
	},
});
