import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import {
	zMessageGallery,
	zMessageLocation,
	zMessagePackage,
	zMessagePersonal,
	zMessageSystem,
	zMessageText,
} from "@zbav-se.me/sdk/api/user";
import { withMessageThreadMessageCollectionQuery } from "@zbav-se.me/sdk/query/user/message-thread";
import { type FC, type RefObject, useLayoutEffect, useRef } from "react";
import { match } from "ts-pattern";
import { useDebouncedCallback } from "use-debounce";
import { MessageGallery } from "~/app/message/type/MessageGallery";
import { MessageLocation } from "~/app/message/type/MessageLocation";
import { MessagePackage } from "~/app/message/type/MessagePackage";
import { MessagePersonal } from "~/app/message/type/MessagePersonal";
import { MessageText } from "~/app/message/type/MessageText";

export namespace MessageList {
	export interface Props extends Container.Props {
		containerRef: RefObject<HTMLDivElement | null>;
		messageThreadId: string;
	}
}

export const MessageList: FC<MessageList.Props> = ({
	messageThreadId,
	containerRef,
	ui,
	...props
}) => {
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
		containerRef.current,
	]);

	return (
		<Container
			ref={contentRef}
			ui={{
				flow: "vertical",
				gap: "lg",
				height: "content",
				...ui,
			}}
			className={"py-1"}
			{...props}
		>
			<withMessageThreadMessageCollectionQuery.Suspense
				data={{
					path: {
						messageThreadId,
					},
					body: {
						sort: [
							{
								field: "createdAt",
								direction: "asc",
							},
						],
					},
				}}
				options={{
					refetchInterval: 1_000 * 5,
				}}
				fallback={<SpinnerContainer />}
			>
				{({ data }) => {
					return data.data.map((message) => {
						return match(message.type)
							.with("text", () => (
								<MessageText
									key={message.id}
									message={zMessageText.parse(message.payload)}
								/>
							))
							.with("system", () => (
								<MessageText
									key={message.id}
									message={zMessageSystem.parse(message.payload)}
								/>
							))
							.with("gallery", () => (
								<MessageGallery
									key={message.id}
									message={zMessageGallery.parse(message.payload)}
								/>
							))
							.with("location", () => (
								<MessageLocation
									key={message.id}
									message={zMessageLocation.parse(message.payload)}
								/>
							))
							.with("personal", () => (
								<MessagePersonal
									key={message.id}
									message={zMessagePersonal.parse(message.payload)}
								/>
							))
							.with("package", () => (
								<MessagePackage
									key={message.id}
									message={zMessagePackage.parse(message.payload)}
								/>
							))
							.with("date", () => null)
							.exhaustive();
					});
				}}
			</withMessageThreadMessageCollectionQuery.Suspense>
		</Container>
	);
};
