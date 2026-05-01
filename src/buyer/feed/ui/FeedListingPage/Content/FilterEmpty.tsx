import type { FC } from "react";
import { translator } from "@/lib/common/translation";
import { EmptyStatus } from "~/common/status/ui/EmptyStatus";

export namespace FilterEmpty {
	export interface Props extends EmptyStatus.Props {
		//
	}
}

export const FilterEmpty: FC<FilterEmpty.Props> = (props) => {
	return (
		<EmptyStatus
			data-ui={"FilterEmpty"}
			icon={"icon-[famicons--trail-sign-outline]"}
			textTitle={translator.text("No listings for current filter (title)")}
			textMessage={translator.text("No listings for current filter (message)")}
			{...props}
		/>
	);
};
