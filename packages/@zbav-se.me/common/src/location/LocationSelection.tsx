import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { Fulltext } from "@use-pico/client/ui/fulltext";
import type { tLocation } from "@zbav-se.me/sdk/api/session";
import { type FC, Suspense, useState } from "react";
import { ListContainer } from "./LocationSelection/ListContainer";

export namespace LocationSelection {
	export interface Props extends Container.Props {
		locale: string;
		value: string | undefined | null;
		onChange(value: string): void;
		onLocation?(value: tLocation): void;
		textHint?: string;
	}
}

export const LocationSelection: FC<LocationSelection.Props> = ({
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
			ui="LocationSelection-root"
			layout={"vertical-header-content"}
			gap={"md"}
			round={"default"}
			height={"fit"}
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
