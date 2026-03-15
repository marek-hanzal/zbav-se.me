import { NotificationIcon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
import { Status } from "@use-pico/client/ui/status";
import { translator } from "@use-pico/common/translator";
import type { FC } from "react";

export namespace Empty {
	export interface Props extends Container.Props {
		//
	}
}

export const Empty: FC<Empty.Props> = ({ ui, ...props }) => {
	return (
		<Container
			data-ui="InboxList[Empty]"
			ui={{
				layout: "vertical-centered",
				height: "full",
				...ui,
			}}
			{...props}
		>
			<Status
				icon={NotificationIcon}
				textTitle={translator.text("Inbox empty (title)")}
				textMessage={translator.text("Inbox empty (message)")}
				ui={{
					tone: "brand",
					theme: "light",
					color: "lead",
					inner: "4xl",
				}}
				className={"text-center"}
			/>
		</Container>
	);
};
