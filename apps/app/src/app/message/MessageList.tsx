import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { zMessageGallery, zMessageLocation, zMessageText } from "@zbav-se.me/sdk/api/user";
import { withMessageThreadMessageCollectionQuery } from "@zbav-se.me/sdk/query/user/message-thread";
import { type FC, useLayoutEffect, useRef } from "react";
import { match } from "ts-pattern";
import { useDebouncedCallback } from "use-debounce";
import { MessageGallery } from "~/app/message/type/MessageGallery";
import { MessageLocation } from "~/app/message/type/MessageLocation";
import { MessageText } from "~/app/message/type/MessageText";

export namespace MessageList {
	export interface Props extends Container.Props {
		messageThreadId: string;
	}
}

export const MessageList: FC<MessageList.Props> = ({ messageThreadId, ui, ...props }) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);
	const scrollToBottom = useDebouncedCallback(
		(behavior: ScrollBehavior) => {
			containerRef.current?.scrollTo({
				top: containerRef.current?.scrollHeight,
				behavior,
			});
		},
		150,
		{
			leading: true,
		},
	);

	useLayoutEffect(() => {
		if (!contentRef.current || !containerRef.current) {
			return;
		}

		scrollToBottom("instant");

		const ro = new ResizeObserver(() => {
			scrollToBottom("smooth");
		});

		ro.observe(contentRef.current);

		return () => {
			ro.disconnect();
		};
	}, [
		scrollToBottom,
	]);

	return (
		<Container
			ref={containerRef}
			data-ui="MessageList[Container]"
			ui={{
				scroll: "vertical",
				height: "full",
				...ui,
			}}
			{...props}
		>
			<Container
				ref={contentRef}
				ui={{
					flow: "vertical",
					gap: "lg",
					height: "content",
				}}
				className={"py-1"}
			>
				<withMessageThreadMessageCollectionQuery.Suspense
					data={{
						path: {
							messageThreadId,
						},
					}}
					options={{
						refetchInterval: 1_000 * 10,
					}}
					fallback={<SpinnerContainer />}
				>
					{({ data }) => {
						return data.data.map((message) => {
							return match(message.type)
								.with("text", () => (
									<MessageText
										key={message.id}
										message={zMessageText.parse(message)}
									/>
								))
								.with("gallery", () => (
									<MessageGallery
										key={message.id}
										message={zMessageGallery.parse(message)}
									/>
								))
								.with("location", () => (
									<MessageLocation
										key={message.id}
										message={zMessageLocation.parse(message)}
									/>
								))
								.exhaustive();
						});
					}}
				</withMessageThreadMessageCollectionQuery.Suspense>
			</Container>
		</Container>
	);
};
