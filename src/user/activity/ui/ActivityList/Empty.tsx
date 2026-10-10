import type { FC } from "react";
import { EmptyStatus } from "~/common/status/ui/EmptyStatus";
import { useTranslator } from "~/translation/hook/useTranslator";
import { NotificationIcon } from "~/ui/constant/NotificationIcon";
import type { Container } from "~/ui/ui/Container";

export namespace Empty {
	export interface Props extends Container.Props {
		//
	}
}

export const Empty: FC<Empty.Props> = (props) => {
	const translator = useTranslator();
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
