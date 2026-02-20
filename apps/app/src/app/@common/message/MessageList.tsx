import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import type { tUserSideEnum } from "@zbav-se.me/sdk/api/public";
import {
	zMessageGallery,
	zMessageLocation,
	zMessagePackage,
	zMessagePersonal,
	zMessageSystem,
	zMessageText,
} from "@zbav-se.me/sdk/api/user";
import { withMessageThreadMessageCollectionQuery } from "@zbav-se.me/sdk/query/user/message-thread";
import { type FC, type RefObject, useEffect, useLayoutEffect, useRef, useState } from "react";
import { match } from "ts-pattern";
import { useDebouncedCallback } from "use-debounce";
import { MessageGallery } from "~/app/@common/message/type/MessageGallery";
import { MessageLocation } from "~/app/@common/message/type/MessageLocation";
import { MessagePackage } from "~/app/@common/message/type/MessagePackage";
import { MessagePersonal } from "~/app/@common/message/type/MessagePersonal";
import { MessageText } from "~/app/@common/message/type/MessageText";

export namespace MessageList {
	export interface Props extends Container.Props {
		side: tUserSideEnum;
		containerRef: RefObject<HTMLDivElement | null>;
		messageThreadId: string;
		refresh: number;
	}
}

export const MessageList: FC<MessageList.Props> = ({
	side,
	messageThreadId,
	containerRef,
	ui,
	children,
	refresh,
	...props
}) => {
	const contentRef = useRef<HTMLDivElement>(null);
	const [ready, setReady] = useState(false);
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

	// biome-ignore lint/correctness/useExhaustiveDependencies: Ssst
	useEffect(() => {
		if (!containerRef.current || !contentRef.current) {
			return;
		}

		setReady(true);
	}, [
		containerRef.current,
		contentRef.current,
	]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: Ssst
	useLayoutEffect(() => {
		if (!contentRef.current || !containerRef.current || !ready) {
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
		ready,
	]);

	return (
		<Container
			data-ui="MessageList-[Container]"
			ref={contentRef}
			ui={{
				flow: "vertical",
				gap: "lg",
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
								order: "asc",
							},
						],
					},
				}}
				options={{
					refetchInterval: refresh,
				}}
				fallback={<SpinnerContainer />}
			>
				{({ data }) => {
					return (
						<>
							{data.map((message) => {
								return match(message.type)
									.with("text", () => (
										<MessageText
											key={message.id}
											side={side}
											message={zMessageText.parse(message.payload)}
										/>
									))
									.with("system", () => (
										<MessageText
											key={message.id}
											side={side}
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
							})}

							{children}
						</>
					);
				}}
			</withMessageThreadMessageCollectionQuery.Suspense>
		</Container>
	);
};
