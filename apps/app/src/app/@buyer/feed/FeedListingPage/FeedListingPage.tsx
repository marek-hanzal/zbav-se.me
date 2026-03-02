import { useLocale, useSentinel } from "@use-pico/client/hook";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { FlowContainer } from "@zbav-se.me/ui/container";
import { uiBackButton } from "@zbav-se.me/ui/ui";
import { type FC, useRef } from "react";
import { Content } from "./Content/Content";

export namespace FeedListingPage {
	export interface Props extends FlowContainer.Props {
		feedId: string;
		scrollToId: string | undefined;
	}
}

export const FeedListingPage: FC<FeedListingPage.Props> = ({ feedId, scrollToId, ...props }) => {
	const locale = useLocale();
	const containerRef = useRef<HTMLDivElement>(null);

	const { sentinelRef, inView: isLast } = useSentinel<HTMLDivElement>({
		containerRef,
		threshold: 0.25,
	});

	return (
		<FlowContainer
			data-ui={"BuyerFeedList[FlowContainer]"}
			left={
				<LinkTo
					{...uiBackButton({
						ui: {
							opacity: isLast ? "none" : "8",
						},
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
			<Content
				feedId={feedId}
				scrollToId={scrollToId}
				sentinelRef={sentinelRef}
				isLast={isLast}
			/>
		</FlowContainer>
	);
};
