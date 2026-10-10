import type { FC } from "react";
import { SearchIcon } from "~/application-ui/constant/icon.exports";
import { EmptyStatus } from "~/status/ui/EmptyStatus";
import { useTranslator } from "~/translation/hook/useTranslator";

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
			textTitle={translator.textFn("No categories found (title)")}
			textMessage={translator.textFn("No categories found (message)")}
			{...props}
		/>
	);
};
