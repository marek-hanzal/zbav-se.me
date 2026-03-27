import { translator } from "@use-pico/common/translator";
import { SearchIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";
import { EmptyStatus } from "~/common/status/ui/EmptyStatus";

export namespace Empty {
	export interface Props extends EmptyStatus.Props {
		//
	}
}

export const Empty: FC<Empty.Props> = (props) => {
	return (
		<EmptyStatus
			data-ui="ListContainer[Container.empty]"
			icon={SearchIcon}
			textTitle={translator.text("Location not found (badge)")}
			{...props}
		/>
	);
};
