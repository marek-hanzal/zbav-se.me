import { useAutoScroll } from "@use-pico/client/hook";
import type { MarkSuspense } from "@use-pico/client/type";
import { Container } from "@use-pico/client/ui/container";
import type { tUserSideEnum } from "@zbav-se.me/sdk/api/public";
import { withMessageThreadMessageCollectionQuery } from "@zbav-se.me/sdk/query/user/message-thread";
import { type FC, type RefObject, useRef } from "react";
import { MessageRenderItem } from "~/app/@common/message/MessageRenderItem";

export namespace MessageList {
	export interface Props extends Container.Props, MarkSuspense.Props {
		side: tUserSideEnum;
		containerRef: RefObject<HTMLDivElement | null>;
		messageThreadId: string;
		refresh: number;
	}
}

export const MessageList: FC<MessageList.Props> = ({
	_suspense,
	side,
	messageThreadId,
	containerRef,
	ui,
	children,
	refresh,
	...props
}) => {
	const contentRef = useRef<HTMLDivElement>(null);
	useAutoScroll({
		containerRef,
		contentRef,
	});
	const { data } = withMessageThreadMessageCollectionQuery.useSuspenseQuery(
		{
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
		},
		{
			refetchInterval: refresh,
		},
	);

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
			{data.map((message) => {
				return (
					<MessageRenderItem
						key={message.id}
						side={side}
						message={message}
					/>
				);
			})}

			{children}
		</Container>
	);
};
