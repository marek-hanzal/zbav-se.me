import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { useLocale } from "@/lib/client/locale";
import { SpinnerContainer } from "@/lib/client/spinner";
import { translator } from "@/lib/common/translator";
import { BackHomeButton } from "~/common/nav/BackHomeButton";
import { TitleContainer } from "~/common/ui/container";
import { HomeMenuButton } from "~/user/home/HomeMenu/HomeMenuButton";

export namespace UserPagePending {
	export interface Props extends TitleContainer.Props {
		//
	}
}

export const UserPagePending: FC<UserPagePending.Props> = ({ ...props }) => {
	const locale = useLocale();

	return (
		<TitleContainer
			data-ui={"UserPagePending"}
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
				data-ui-layout="vertical-centered"
				data-ui-height="full"
			>
				<SpinnerContainer />
			</Container>
		</TitleContainer>
	);
};
