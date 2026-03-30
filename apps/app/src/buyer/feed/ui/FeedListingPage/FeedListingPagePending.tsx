import { LinkTo } from "@/lib/client/link-to";
import type { FC } from "react";
import { ArrowLeftIcon } from "@/lib/client/icon";
import { useLocale } from "@/lib/client/locale";
import { SpinnerContainer } from "@/lib/client/spinner";
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
