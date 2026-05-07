import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { MessageContent } from "./MessageContent";

export namespace UserMessage {
	export interface Props extends MessageContent.Props {
		//
	}
}

export const UserMessage: FC<UserMessage.Props> = (props) => {
	return (
		<Container
			data-ui={"UserMessage"}
			data-ui-tone={"neutral"}
			data-ui-theme={"light"}
			data-ui-background={"default"}
			data-ui-shadow={undefined}
			data-ui-border={undefined}
			data-ui-round={"xl"}
			data-ui-inner={"default"}
			className={[
				"max-w-4/5",
				"w-fit",
				"ml-auto",
			]}
		>
			<MessageContent
				data-ui={"UserMessage"}
				data-ui-background={undefined}
				data-ui-shadow={false}
				data-ui-border={false}
				data-ui-inner={"default"}
				{...props}
			/>
		</Container>
	);
};
