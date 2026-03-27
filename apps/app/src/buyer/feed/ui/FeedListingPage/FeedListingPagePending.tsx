import { useLocale } from "@use-pico/client/hook";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { SpinnerContainer } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import type { FC } from "react";
import { FlowContainer } from "~/common/ui/container";
import { uiBackButton } from "~/common/ui/ui";

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
				<LinkTo
					{...uiBackButton({
						className: [],
					})}
					data-action={"go home"}
					icon={ArrowLeftIcon}
					to={"/$locale/app/home"}
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
