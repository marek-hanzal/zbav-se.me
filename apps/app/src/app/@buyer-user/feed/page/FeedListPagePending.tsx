import { useLocale } from "@use-pico/client/hook";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { SpinnerContainer } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { FlowContainer } from "@zbav-se.me/ui/container";
import { uiBackButton } from "@zbav-se.me/ui/ui";
import type { FC } from "react";

export namespace FeedListPagePending {
	export interface Props extends FlowContainer.Props {
		//
	}
}

export const FeedListPagePending: FC<FeedListPagePending.Props> = (props) => {
	const locale = useLocale();
	return (
		<FlowContainer
			data-ui={"BuyerFeedList[FlowContainer]"}
			left={
				<LinkTo
					{...uiBackButton({
						className: [],
					})}
					data-ui={"BuyerFeedList-[LinkTo.left]"}
					icon={ArrowLeftIcon}
					to={"/$locale/home"}
					params={{
						locale,
					}}
					className={"transition-all"}
				/>
			}
			{...props}
		>
			<SpinnerContainer />
		</FlowContainer>
	);
};
