import { type FC, Suspense, useState } from "react";
import { Container } from "@/lib/client/container";
import { Fulltext } from "@/lib/client/fulltext";
import type { Status } from "@/lib/client/status";
import { translator } from "@/lib/common/translator";
import { ListContainer } from "~/common/location/ui/LocationSelect/ListContainer";
import type { LocationSchema } from "~/session/location/server/schema/LocationSchema";

export namespace LocationSelect {
	export interface Props extends Omit<Container.Props, "onChange"> {
		value: string | undefined | null;
		onChange(value: string | null): void;
		allowClear?: boolean;
		onLocation?(value: LocationSchema.Type): void;
		onSearchChange?(value: Fulltext.Value): void;
		textHint: string;
		warningStatusProps?: Status.Props;
	}
}

/**
 * Provides an interactive control for selecting location values in forms.
 * Use it in editors where users need to choose or update location before saving.
 *
 * @see src/draft/ui/DraftEditor/DraftEditor.tsx
 */
export const LocationSelect: FC<LocationSelect.Props> = ({
	value,
	onChange,
	allowClear,
	onLocation,
	onSearchChange,
	textHint,
	warningStatusProps,
	...props
}) => {
	const [search, setSearch] = useState<Fulltext.Value>();
	const handleSearchChange = (value: Fulltext.Value) => {
		setSearch(value);
		onSearchChange?.(value);
	};

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
					set: handleSearchChange,
				}}
				textPlaceholder={translator.text("Location search (placeholder)")}
			/>

			<Suspense fallback={<ListContainer.Fallback />}>
				<ListContainer
					textHint={textHint}
					search={search}
					value={value}
					onChange={onChange}
					allowClear={allowClear}
					onLocation={onLocation}
					warningStatusProps={warningStatusProps}
				/>
			</Suspense>
		</Container>
	);
};
