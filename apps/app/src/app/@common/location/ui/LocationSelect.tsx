import { Container } from "@use-pico/client/ui/container";
import { Fulltext } from "@use-pico/client/ui/fulltext";
import type { Status } from "@use-pico/client/ui/status";
import { translator } from "@use-pico/common/translator";
import type { tLocation } from "@zbav-se.me/sdk/api/session";
import { type FC, useState } from "react";
import { ListContainer } from "~/app/v0/@common/location/ui/LocationSelect/ListContainer";

export namespace LocationSelect {
	export interface Props extends Omit<Container.Props, "onChange"> {
		value: string | undefined | null;
		onChange(value: string): void;
		onLocation?(value: tLocation): void;
		textHint: string;
		warningStatusProps?: Status.Props;
	}
}

export const LocationSelect: FC<LocationSelect.Props> = ({
	value,
	onChange,
	onLocation,
	textHint,
	ui,
	warningStatusProps,
	...props
}) => {
	const [search, setSearch] = useState<Fulltext.Value>();

	return (
		<Container
			data-ui="LocationSelect[Container]"
			ui={{
				layout: "vertical-header-content",
				height: "full",
				gap: "default",
				...ui,
			}}
			{...props}
		>
			<Fulltext
				state={{
					value: search,
					set: setSearch,
				}}
				textPlaceholder={translator.text("Location search (placeholder)")}
			/>

			<ListContainer
				textHint={textHint}
				search={search}
				value={value}
				onChange={onChange}
				onLocation={onLocation}
				warningStatusProps={warningStatusProps}
			/>
		</Container>
	);
};
