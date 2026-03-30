import { translator } from "@use-pico/common/translator";
import type { FC } from "react";
import type { Container } from "@/lib/client/container";
import { NotificationIcon } from "@/lib/client/icon";
import { EmptyStatus } from "~/common/status/ui/EmptyStatus";

export namespace Empty {
	export interface Props extends Container.Props {
		//
	}
}

export const Empty: FC<Empty.Props> = ({ ui, ...props }) => {
	return (
		<EmptyStatus
			data-ui="InboxList[Empty]"
			icon={NotificationIcon}
			textTitle={translator.text("Inbox empty (title)")}
			textMessage={translator.text("Inbox empty (message)")}
			ui={ui}
			{...props}
		/>
	);
};
