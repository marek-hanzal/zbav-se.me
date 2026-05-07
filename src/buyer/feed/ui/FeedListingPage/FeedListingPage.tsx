import { type FC, useRef } from "react";
import { useLocale } from "@/lib/client/locale";
import type { MarkSuspense } from "@/lib/client/type";
import { BackHomeButton } from "~/common/nav/BackHomeButton";
import { FlowContainer } from "~/common/ui/container";
import { HomeMenuButton } from "~/user/home/HomeMenu/HomeMenuButton";
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

	return (
		<FlowContainer
			data-ui={"FeedListingPage"}
			ref={containerRef}
			left={
				<BackHomeButton
					to="/$locale/app/buyer/feed/list"
					params={{
						locale,
					}}
				/>
			}
			right={<HomeMenuButton />}
			{...props}
		>
			<Content
				_suspense={"I know"}
				feedId={feedId}
				scrollToId={scrollToId}
				sentinelRef={sentinelRef}
			/>
		</FlowContainer>
	);
};
