import type { Fulltext } from "@use-pico/client/ui/fulltext";
import type { Status } from "@use-pico/client/ui/status";
import { type FC, Suspense } from "react";
import { Data } from "./Data";
import { Default } from "./Default";
import { Pending } from "./Pending";

export namespace ListContainer {
	export interface Props extends Omit<Data.Props, "_suspense" | "text"> {
		textHint: string;
		search: Fulltext.Value;
		warningStatusProps?: Status.Props;
	}
}

export const ListContainer: FC<ListContainer.Props> = ({
	textHint,
	search,
	value,
	ui,
	warningStatusProps,
	...props
}) => {
	const text = search ?? value ?? "";

	if (text.length < 3) {
		return (
			<Default
				textHint={textHint}
				warningStatusProps={warningStatusProps}
				ui={ui}
			/>
		);
	}

	return (
		<Suspense fallback={<Pending />}>
			<Data
				_suspense={"I know"}
				text={text}
				value={value}
				ui={ui}
				{...props}
			/>
		</Suspense>
	);
};
