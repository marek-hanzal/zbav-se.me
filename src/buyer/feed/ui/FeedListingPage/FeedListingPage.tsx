import { type FC, useRef } from "react";
import { ArrowLeftIcon } from "@/lib/client/icon";
import { LinkTo } from "@/lib/client/link-to";
import { useLocale } from "@/lib/client/locale";
import { useSentinel } from "@/lib/client/sentinel";
import type { MarkSuspense } from "@/lib/client/type";
import { FlowContainer } from "~/common/ui/container";
import { uiBackButton } from "~/common/ui/ui";
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
