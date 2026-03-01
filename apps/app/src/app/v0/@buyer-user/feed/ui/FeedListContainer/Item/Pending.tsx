import { translator } from "@use-pico/common/translator";
import type { FC } from "react";
import type { Data } from "./Data";
import { View } from "./View";

export namespace Pending {
	export interface Props extends Data.Props {
		//
	}
}

export const Pending: FC<Pending.Props> = ({ feedId, tools, linkTo }) => {
	return (
		<View
			feed={{
				id: feedId,
				locationId: null,
				name: translator.text("Loading... (label)"),
				query: {},
				upload: null,
				uploadId: null,
			}}
			tools={tools}
			linkTo={linkTo}
		/>
	);
};
