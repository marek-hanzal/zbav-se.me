import type { Container } from "@use-pico/client/ui/container";
import type { Fulltext } from "@use-pico/client/ui/fulltext";
import type { Status } from "@use-pico/client/ui/status";
import type { tLocation } from "@zbav-se.me/sdk/api/session";
import { type FC, Suspense } from "react";
import { ListContainerContent } from "../ListContainerContent";
import { ListContainerContentPending } from "../ListContainerContentPending";
import { Default } from "./Default";

export namespace ListContainer {
	export interface Props extends Omit<Container.Props, "onChange"> {
		textHint: string;
		search: Fulltext.Value;
		value: string | undefined | null;
		onChange(value: string): void;
		onLocation?(value: tLocation): void;
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
		<Suspense fallback={<ListContainerContentPending />}>
			<ListContainerContent
				_suspense={"I know"}
				text={text}
				value={value}
				ui={ui}
				{...props}
			/>
		</Suspense>
	);
};
