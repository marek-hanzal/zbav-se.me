import { translator } from "@use-pico/common/translator";
import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { UserIcon } from "@/lib/client/icon";
import { useLocale } from "@/lib/client/locale";
import { Status } from "@/lib/client/status";
import { useUser } from "~/common/auth/hook/useUser";
import { BackHomeButton } from "~/common/nav/BackHomeButton";
import { TitleContainer } from "~/common/ui/container";
import { HomeMenuButton } from "~/user/home/~public/HomeMenuButton";
import { SignOutButton } from "./SignOutButton";

export namespace UserPage {
	export interface Props extends TitleContainer.Props {
		//
	}
}

/**
 * Composes the route-level user screen and arranges the main page structure for this flow.
 * Use it from route definitions as the primary UI boundary for the user journey.
 *
 * @see apps/app/src/@routes
 */
export const UserPage: FC<UserPage.Props> = ({ ui, ...props }) => {
	const locale = useLocale();
	const user = useUser();

	return (
		<TitleContainer
			data-ui={"User[TitleContainer]"}
			textTitle={translator.text("User profile (title)")}
			left={
				<BackHomeButton
					to="/$locale/app/home"
					params={{
						locale,
					}}
				/>
			}
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
