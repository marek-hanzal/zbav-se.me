import { type FC, useRef, useState } from "react";
import { Button } from "@/lib/client/button";
import { SettingsIcon } from "@/lib/client/icon";
import { useLocale } from "@/lib/client/locale";
import { useSentinel } from "@/lib/client/sentinel";
import type { MarkSuspense } from "@/lib/client/type";
import { FeedEditorSheet } from "~/buyer/feed/ui/FeedEditor/FeedEditorSheet";
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
	const [isEditor, setIsEditor] = useState(false);

	const { inView: isLast } = useSentinel<HTMLDivElement>({
		containerRef,
		sentinelRef,
		threshold: 0.25,
	});

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

			<Button
				data-action={isEditor ? "close feed setup" : "open feed setup"}
				iconEnabled={SettingsIcon}
				onClick={() => setIsEditor((prev) => !prev)}
				ui={{
					tone: "secondary",
					theme: "light",
					background: "default",
					justify: "center",
					items: "center",
					square: "default",
					zIndex: true,
					round: "full",
					snapTo: "right-center",
					text: "xl",
					opacity: isLast ? "full" : "8",
				}}
				className={"transition-all"}
			/>

			<FeedEditorSheet
				feedId={feedId}
				state={{
					value: isEditor,
					set: setIsEditor,
				}}
			/>
		</FlowContainer>
	);
};
