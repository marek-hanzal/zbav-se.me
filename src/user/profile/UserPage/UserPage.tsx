import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { Group } from "@/lib/client/group";
import { UserIcon } from "@/lib/client/icon";
import { useLocale } from "@/lib/client/locale";
import { Status } from "@/lib/client/status";
import type { MarkSuspense } from "@/lib/client/type";
import { LabelValue } from "@/lib/client/value";
import { translator } from "@/lib/common/translator";
import { BackHomeButton } from "~/common/nav/BackHomeButton";
import { TitleContainer } from "~/common/ui/container";
import { TokenUsage } from "~/user/agent/ui/TokenUsage";
import { useUser } from "~/user/auth/hook/useUser";
import { HomeMenuButton } from "~/user/home/HomeMenu/HomeMenuButton";
import { SignOutButton } from "~/user/profile/UserPage/SignOutButton";

export namespace UserPage {
	export interface Props extends TitleContainer.Props, MarkSuspense.Props {
		//
	}
}

/**
 * Composes the route-level user screen and arranges the main page structure for this flow.
 * Use it from route definitions as the primary UI boundary for the user journey.
 *
 * @see src/@routes
 */
export const UserPage: FC<UserPage.Props> = ({ ...props }) => {
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
			>
				<Status
					data-ui-tone={"brand"}
					data-ui-theme={"light"}
					icon={UserIcon}
				/>

				<Group>
					<LabelValue
						textLabel={translator.text("User email (label)")}
						textHint={translator.text("User email (hint)")}
						textValue={user.email}
					/>
				</Group>

				<Group>
					<LabelValue
						textLabel={translator.text("User restriction level (label)")}
						textHint={translator.text("User restriction level (hint)")}
						textValue={"boo"}
					/>
				</Group>

				<Group>
					<LabelValue
						textLabel={translator.text("Token usage (label)")}
						textHint={translator.text("Token usage (hint)")}
						textValue={<TokenUsage data-ui-justify={"start"} />}
					/>
				</Group>

				<Group>
					<SignOutButton data-ui-width={"full"} />
				</Group>
			</Container>
		</TitleContainer>
	);
};
