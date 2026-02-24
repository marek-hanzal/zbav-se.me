import { WarningIcon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
import type { Fulltext } from "@use-pico/client/ui/fulltext";
import { Mx } from "@use-pico/client/ui/mx";
import { Status } from "@use-pico/client/ui/status";
import type { tLocation } from "@zbav-se.me/sdk/api/session";
import { uiWarningStatus } from "@zbav-se.me/ui/ui";
import { type FC, Suspense } from "react";
import { ListContainerContent } from "./ListContainerContent";
import { ListContainerContentPending } from "./ListContainerContentPending";

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
	onChange,
	onLocation,
	ui,
	warningStatusProps,
	...props
}) => {
	const text = search ?? value ?? "";

	if (text.length < 3) {
		return (
			<Container
				data-ui="ListContainer[Container.default]"
				ui={{
					layout: "vertical-centered",
					scroll: "vertical",
					height: "full",
					...ui,
				}}
			>
				<Status
					icon={WarningIcon}
					{...uiWarningStatus({
						className: [],
					})}
					{...warningStatusProps}
				>
					<Container
						ui={{
							text: "default",
						}}
					>
						<Mx
							label={textHint}
							ui={{
								tone: "secondary",
								theme: "light",
							}}
						/>
					</Container>
				</Status>
			</Container>
		);
	}

	return (
		<Suspense fallback={<ListContainerContentPending />}>
			<ListContainerContent
				_suspense={"I know"}
				text={text}
				value={value}
				onChange={onChange}
				onLocation={onLocation}
				ui={ui}
				{...props}
			/>
		</Suspense>
	);
};
