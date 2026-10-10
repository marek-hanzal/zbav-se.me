import { createFileRoute } from "@tanstack/react-router";
import { BackHomeButton } from "~/common/nav/BackHomeButton";
import { TitleContainer } from "~/common/ui/container";
import { useLocale } from "~/locale/hook/useLocale";
import { useTranslator } from "~/translation/hook/useTranslator";
import { UserIcon } from "~/ui/constant/UserIcon";
import { Container } from "~/ui/ui/Container";
import { Group } from "~/ui/ui/Group";
import { Icon } from "~/ui/ui/Icon";
import { LabelValue } from "~/ui/ui/LabelValue";
import { SpinnerContainer } from "~/ui/ui/SpinnerContainer";
import { TokenUsage } from "~/user/agent/ui/TokenUsage";
import { useUser } from "~/user/auth/hook/useUser";
import { HomeMenuButton } from "~/user/home/HomeMenu/HomeMenuButton";
import { ChangePasswordButton } from "~/user/profile/ui/ChangePasswordButton";
import { SignOutButton } from "~/user/profile/ui/SignOutButton";
import { UserRestriction } from "~/user/profile/ui/UserRestriction";
import { VerifyEmailButton } from "~/user/profile/ui/VerifyEmailButton";

export const Route = createFileRoute("/$locale/app/user")({
	component() {
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
	},
	pendingComponent: () => {
		const translator = useTranslator();
		const locale = useLocale();

		return (
			<TitleContainer
				data-ui={"UserPending[TitleContainer]"}
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
			>
				<Container
					data-ui-layout="vertical-centered"
					data-ui-height="full"
				>
					<SpinnerContainer />
				</Container>
			</TitleContainer>
		);
	},
});
