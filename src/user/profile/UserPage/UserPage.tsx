import { CompositeComponent } from "@tanstack/react-start/rsc";
import type { FC } from "react";
import { useLocale } from "@/lib/client/locale";
import type { MarkSuspense } from "@/lib/client/type";
import { translator } from "@/lib/common/translator";
import { BackHomeButton } from "~/common/nav/BackHomeButton";
import { TitleContainer } from "~/common/ui/container";
import { HomeMenuButton } from "~/user/home/HomeMenu/HomeMenuButton";
import { SignOutButton } from "~/user/profile/UserPage/SignOutButton";
import { useUserProfileFnQuery } from "~/user/profile/UserPage/useUserProfileFnQuery";

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
export const UserPage: FC<UserPage.Props> = ({ ui, ...props }) => {
	const locale = useLocale();
	const UserProfile = useUserProfileFnQuery();

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
			<CompositeComponent
				src={UserProfile}
				signOutButton={() => <SignOutButton locale={locale} />}
			/>
		</TitleContainer>
	);
};
