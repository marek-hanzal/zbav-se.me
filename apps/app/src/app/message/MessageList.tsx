import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { zMessageGallery, zMessageLocation, zMessageText } from "@zbav-se.me/sdk/api/user";
import { withMessageThreadMessageCollectionQuery } from "@zbav-se.me/sdk/query/user/message-thread";
import type { FC } from "react";
import { match } from "ts-pattern";
import { MessageGallery } from "~/app/message/type/MessageGallery";
import { MessageLocation } from "~/app/message/type/MessageLocation";
import { MessageText } from "~/app/message/type/MessageText";

export namespace MessageList {
	export interface Props extends Container.Props {
		messageThreadId: string;
	}
}

export const MessageList: FC<MessageList.Props> = ({ messageThreadId, ui, ...props }) => {
	return (
		<Container
			ui={{
				flow: "vertical",
				gap: "lg",
				...ui,
			}}
			{...props}
		>
			<withMessageThreadMessageCollectionQuery.Suspense
				data={{
					path: {
						messageThreadId,
					},
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
	);
};
