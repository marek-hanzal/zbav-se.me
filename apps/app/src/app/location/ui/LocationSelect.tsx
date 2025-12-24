import { Container } from "@use-pico/client/ui/container";
import { Fulltext } from "@use-pico/client/ui/fulltext";
import type { tLocation } from "@zbav-se.me/sdk/api/session";
import { type FC, useState } from "react";
import { ListContainer } from "./location-select/ListContainer";

export namespace LocationSelect {
	export interface Props extends Omit<Container.Props, "onChange"> {
		value: string | undefined | null;
		onChange(value: string): void;
		onLocation?(value: tLocation): void;
		textHint: string;
	}
}

export const LocationSelect: FC<LocationSelect.Props> = ({
	value,
	onChange,
	onLocation,
	textHint,
	ui,
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
				textPlaceholder={"Location search (placeholder)"}
				tweak={{
					slot: {
						input: {
							class: [
								"px-8",
							],
							token: [
								"size.lg",
							],
						},
					},
				}}
			/>

			<ListContainer
				textHint={textHint}
				search={search}
				value={value}
				onChange={onChange}
				onLocation={onLocation}
			/>
		</Container>
	);
};
