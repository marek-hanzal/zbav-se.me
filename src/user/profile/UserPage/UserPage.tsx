import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { Group } from "@/lib/client/group";
import { Icon, UserIcon } from "@/lib/client/icon";
import { useLocale } from "@/lib/client/locale";
import { useTranslator } from "@/lib/client/translation";
import type { MarkSuspense } from "@/lib/client/type";
import { LabelValue } from "@/lib/client/value";
import { BackHomeButton } from "~/common/nav/BackHomeButton";
import { TitleContainer } from "~/common/ui/container";
import { TokenUsage } from "~/user/agent/ui/TokenUsage";
import { useUser } from "~/user/auth/hook/useUser";
import { HomeMenuButton } from "~/user/home/HomeMenu/HomeMenuButton";
import { SignOutButton } from "~/user/profile/UserPage/SignOutButton";
import { VerifyEmailButton } from "~/user/profile/UserPage/VerifyEmailButton";
import { ChangePasswordButton } from "./ChangePasswordButton";
import { UserRestriction } from "./UserRestriction";

export namespace UserPage {
	export interface Props extends TitleContainer.Props, MarkSuspense.Props {
		//
	}
}

/**
 * Composes the route-level user screen and arranges the main page structure for this flow.
 * Use it from route definitions as the primary UI boundary for the user journey.
 */
export const UserPage: FC<UserPage.Props> = ({ ...props }) => {
	const translator = useTranslator();
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
			data-ui-layout="vertical-header-content"
			{...props}
		>
			<Container
				data-ui-flow={"vertical"}
				data-ui-gap={"default"}
				data-ui-inner={"default"}
				data-ui-scroll={"vertical"}
				data-ui-height={"full"}
			>
				<Container
					data-ui-flow={"horizontal"}
					data-ui-justify={"center"}
					data-ui-width={"full"}
				>
					<Icon
						icon={UserIcon}
						data-ui-tone={"brand"}
						data-ui-theme={"light"}
						data-ui-color={"lead"}
						data-ui-text={"4xl"}
					/>
				</Container>

				<Group>
					<LabelValue
						textLabel={translator.text("User email (label)")}
						textHint={translator.text(
							user.emailVerified
								? "Your email is verified."
								: "Your email is not verified yet.",
						)}
						textValue={user.email}
					/>

					{!user.emailVerified ? <VerifyEmailButton email={user.email} /> : null}
				</Group>

				<Group>
					<UserRestriction />
				</Group>

				<Group>
					<LabelValue
						textLabel={translator.text("Token usage (label)")}
						textHint={translator.text("Token usage (hint)")}
						textValue={<TokenUsage data-ui-justify={"start"} />}
					/>
				</Group>

				<Group>
					<ChangePasswordButton />
				</Group>

				<Group>
					<SignOutButton data-ui-width={"full"} />
				</Group>
			</Container>
		</TitleContainer>
	);
};
