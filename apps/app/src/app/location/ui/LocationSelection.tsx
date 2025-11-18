import { Container } from "@use-pico/client/ui/container";
import { Fulltext } from "@use-pico/client/ui/fulltext";
import type { tLocation } from "@zbav-se.me/sdk/api/session";
import { SpinnerContainer } from "@zbav-se.me/ui/container";
import { type FC, Suspense, useState } from "react";
import { ListContainer } from "~/app/location/ui/LocationSelection/ListContainer";

export namespace LocationSelection {
	export interface Props extends Container.Props {
		value: string | undefined | null;
		onChange(value: string): void;
		onLocation?(value: tLocation): void;
		textHint?: string;
	}
}

export const LocationSelection: FC<LocationSelection.Props> = ({
	value,
	onChange,
	onLocation,
	textHint,
	...props
}) => {
	const [search, setSearch] = useState<Fulltext.Value>();

	return (
		<Container
			ui="LocationSelection-root"
			layout={"vertical-header-content"}
			gap={"md"}
			round={"default"}
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
