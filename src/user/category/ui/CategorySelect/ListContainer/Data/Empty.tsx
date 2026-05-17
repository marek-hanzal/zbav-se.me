import type { FC } from "react";
import { useTranslator } from "@/lib/client/translation";
import { EmptyStatus } from "~/common/status/ui/EmptyStatus";
import { SearchIcon } from "~/common/ui/icon";

export namespace Empty {
	export interface Props extends EmptyStatus.Props {
		//
	}
}

export const Empty: FC<Empty.Props> = (props) => {
	const translator = useTranslator();
	return (
		<EmptyStatus
			data-ui="ListContainer[Container.empty]"
			icon={SearchIcon}
			textTitle={translator.text("No categories found (title)")}
			textMessage={translator.text("No categories found (message)")}
			{...props}
		/>
	);
};
