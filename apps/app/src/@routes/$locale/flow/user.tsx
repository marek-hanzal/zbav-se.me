import { createFileRoute } from "@tanstack/react-router";
import { UserIcon } from "@use-pico/client/icon";
import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { Status } from "@use-pico/client/ui/status";
import { translator } from "@use-pico/common/translator";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { useUser } from "~/app/@common/auth/hook/useUser";
import { SignOutButton } from "~/app/@common/auth/ui/SignOutButton";
import { HomeMenuButton } from "~/app/@user/home/HomeMenuButton";

export const Route = createFileRoute("/$locale/flow/user")({
	pendingComponent() {
		return (
			<TitleContainer
				data-ui={"User"}
				textTitle={translator.text("User profile (title)")}
				ui={{
					layout: "vertical-header-content",
				}}
				right={<HomeMenuButton />}
			>
				<SpinnerContainer />
			</TitleContainer>
		);
	},
	component() {
		const user = useUser();

		return (
			<TitleContainer
				data-ui={"User"}
				textTitle={translator.text("User profile (title)")}
				ui={{
					layout: "vertical-header-content",
				}}
				right={<HomeMenuButton />}
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
