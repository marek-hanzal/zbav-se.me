import type { FC } from "react";
import { EmptyStatus } from "~/status/ui/EmptyStatus";
import { useTranslator } from "~/translation/hook/useTranslator";

export namespace FilterEmpty {
	export interface Props extends EmptyStatus.Props {
		//
	}
}

export const FilterEmpty: FC<FilterEmpty.Props> = (props) => {
	const translator = useTranslator();
	return (
		<EmptyStatus
			data-ui={"FilterEmpty[EmptyStatus]"}
			icon={"icon-[famicons--trail-sign-outline]"}
			textTitle={translator.textFn("No listings for current filter (title)")}
			textMessage={translator.textFn("No listings for current filter (message)")}
			{...props}
		/>
	);
};
