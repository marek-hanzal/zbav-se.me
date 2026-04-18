import type { FC } from "react";
import type { Container } from "@/lib/client/container";
import { NotificationIcon } from "@/lib/client/icon";
import { translator } from "@/lib/common/translator";
import { EmptyStatus } from "~/common/status/ui/EmptyStatus";

export namespace Empty {
	export interface Props extends Container.Props {
		//
	}
}

export const Empty: FC<Empty.Props> = (props) => {
	return (
		<EmptyStatus
			data-ui="ActivityList[Empty]"
			icon={NotificationIcon}
			textTitle={translator.text("Activity empty (title)")}
			textMessage={translator.text("Activity empty (message)")}
			{...props}
		/>
	);
};
