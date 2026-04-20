import type { FC } from "react";
import { Group } from "@/lib/client/group";
import { MessageContent } from "./MessageContent";

export namespace UserMessage {
	export interface Props extends MessageContent.Props {
		//
	}
}

export const UserMessage: FC<UserMessage.Props> = (props) => {
	return (
		<Group
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
				partProps={{
					"data-ui-inner": "default",
					"data-ui-round": undefined,
					"data-ui-border": false,
					"data-ui-background": undefined,
					"data-ui-shadow": undefined,
				}}
				{...props}
			/>
		</Group>
	);
};
