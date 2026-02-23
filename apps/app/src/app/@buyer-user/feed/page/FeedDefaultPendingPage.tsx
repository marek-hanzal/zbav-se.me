import { useLocale } from "@use-pico/client/hook";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { SpinnerContainer } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { FlowContainer } from "@zbav-se.me/ui/container";
import { uiBackButton } from "@zbav-se.me/ui/ui";
import type { FC } from "react";

export namespace FeedDefaultPendingPage {
	export interface Props extends FlowContainer.Props {}
}

export const FeedDefaultPendingPage: FC<FeedDefaultPendingPage.Props> = ({
	children,
	...props
}) => {
	const locale = useLocale();

	return (
		<FlowContainer
			left={
				<LinkTo
					{...uiBackButton({
						className: [],
					})}
					icon={ArrowLeftIcon}
					to={"/$locale/flow/home"}
					params={{
						locale,
					}}
				/>
			}
			{...props}
		>
			<SpinnerContainer />

			{children}
		</FlowContainer>
	);
};
