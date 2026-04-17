import type { FC } from "react";
import { Button } from "@/lib/client/button";
import { SettingsIcon } from "@/lib/client/icon";
import { useLocale } from "@/lib/client/locale";
import { SpinnerContainer } from "@/lib/client/spinner";
import { BackHomeButton } from "~/common/nav/BackHomeButton";
import { FlowContainer } from "~/common/ui/container";
import { HomeMenuButton } from "~/user/home/HomeMenu/HomeMenuButton";

export namespace FeedListingPagePending {
	export interface Props extends FlowContainer.Props {
		//
	}
}

export const FeedListingPagePending: FC<FeedListingPagePending.Props> = (props) => {
	const locale = useLocale();

	return (
		<FlowContainer
			data-ui={"FeedListingPagePending"}
			left={
				<BackHomeButton
					to="/$locale/app/home"
					params={{
						locale,
					}}
				/>
			}
			right={<HomeMenuButton />}
			{...props}
		>
			<SpinnerContainer />

			<Button
				iconEnabled={SettingsIcon}
				ui={{
					tone: "secondary",
					theme: "light",
					background: "default",
					justify: "center",
					items: "center",
					square: "default",
					zIndex: true,
					round: "full",
					snapTo: "bottom-right",
					text: "xl",
					opacity: "8",
				}}
				disabled
				className={"transition-all"}
			/>
		</FlowContainer>
	);
};
