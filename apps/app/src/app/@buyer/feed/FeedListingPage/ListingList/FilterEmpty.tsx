import { Status } from "@use-pico/client/ui/status";
import { translator } from "@use-pico/common/translator";
import type { FC } from "react";

export namespace FilterEmpty {
	export type Props = {};
}

export const FilterEmpty: FC<FilterEmpty.Props> = () => {
	return (
		<Status
			data-ui={"ListingListContainer-[Status.filter-empty]"}
			icon={"icon-[streamline--sad-face-remix]"}
			textTitle={translator.text("No listings for current filter (title)")}
			textMessage={translator.text("No listings for current filter (message)")}
		/>
	);
};
