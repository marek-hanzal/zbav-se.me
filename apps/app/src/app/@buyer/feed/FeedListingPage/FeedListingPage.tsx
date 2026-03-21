import { useLocale, useSentinel } from "@use-pico/client/hook";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import type { MarkSuspense } from "@use-pico/client/type";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { FlowContainer } from "@zbav-se.me/ui/container";
import { uiBackButton } from "@zbav-se.me/ui/ui";
import { type FC, useRef } from "react";
import { Content } from "./Content";

export namespace FeedListingPage {
	export interface Props extends FlowContainer.Props, MarkSuspense.Props {
		feedId: string;
		scrollToId: string | undefined;
	}
}

export const FeedListingPage: FC<FeedListingPage.Props> = ({
	_suspense,
	feedId,
	scrollToId,
	...props
}) => {
	const locale = useLocale();
	const containerRef = useRef<HTMLDivElement>(null);
	const sentinelRef = useRef<HTMLDivElement>(null);

	const { inView: isLast } = useSentinel<HTMLDivElement>({
		containerRef,
		sentinelRef,
		threshold: 0.25,
	});

	return (
		<FlowContainer
			ref={containerRef}
			data-ui={"FeedListingPage"}
			left={
				<LinkTo
					{...uiBackButton({
						ui: {
							opacity: isLast ? "none" : "8",
						},
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
			<Content
				_suspense={"I know"}
				feedId={feedId}
				scrollToId={scrollToId}
				sentinelRef={sentinelRef}
				isLast={isLast}
			/>
		</FlowContainer>
	);
};
