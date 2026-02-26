import { UserIcon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
import { Status } from "@use-pico/client/ui/status";
import { translator } from "@use-pico/common/translator";
import { TitleContainer } from "@zbav-se.me/ui/container";
import type { FC } from "react";
import { HomeMenuButton } from "~/app/@user/home/HomeMenuButton";
import { useUser } from "~/app/v0/@common/auth/hook/useUser";
import { SignOutButton } from "~/app/v0/@common/auth/ui/SignOutButton";

export namespace UserPage {
	export interface Props extends TitleContainer.Props {}
}

export const UserPage: FC<UserPage.Props> = ({ ui, ...props }) => {
	const user = useUser();

	return (
		<TitleContainer
			data-ui={"User[TitleContainer]"}
			textTitle={translator.text("User profile (title)")}
			right={<HomeMenuButton />}
			ui={{
				layout: "vertical-header-content",
				...ui,
			}}
			{...props}
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
};
