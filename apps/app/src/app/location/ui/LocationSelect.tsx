import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { Fulltext } from "@use-pico/client/ui/fulltext";
import type { tLocation } from "@zbav-se.me/sdk/api/session";
import { type FC, Suspense, useState } from "react";
import { ListContainer } from "./location-select/ListContainer";

export namespace LocationSelect {
	export interface Props extends Omit<Container.Props, "onChange"> {
		locale: string;
		value: string | undefined | null;
		onChange(value: string): void;
		onLocation?(value: tLocation): void;
		textHint?: string;
	}
}

export const LocationSelect: FC<LocationSelect.Props> = ({
	locale,
	value,
	onChange,
	onLocation,
	textHint,
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

			<Suspense fallback={<SpinnerContainer />}>
				<ListContainer
					_suspense={"I know"}
					locale={locale}
					textHint={textHint}
					search={search}
					value={value}
					onChange={onChange}
					onLocation={onLocation}
				/>
			</Suspense>
		</Container>
	);
};
