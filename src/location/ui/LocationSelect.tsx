import { type FC, Suspense, useState } from "react";
import { ListContainer } from "~/location/ui/ListContainer/LocationSelect.exports";
import type { LocationSchema } from "~/session-location/schema/LocationSchema";
import { useTranslator } from "~/translation/hook/useTranslator";
import { Container } from "~/ui/ui/Container";
import { Fulltext } from "~/ui/ui/Fulltext";
import type { Status } from "~/ui/ui/Status";

export namespace LocationSelect {
	export interface Props extends Omit<Container.Props, "onChange"> {
		value: string | undefined | null;
		onChangeFn(value: string | null): void;
		allowClear?: boolean;
		onLocationFn?(value: LocationSchema.Type): void;
		onSearchChangeFn?(value: Fulltext.Value): void;
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
	onChangeFn,
	allowClear,
	onLocationFn,
	onSearchChangeFn,
	textHint,
	warningStatusProps,
	...props
}) => {
	const translator = useTranslator();
	const [search, setSearchFn] = useState<Fulltext.Value>();
	const handleSearchChangeFn = (value: Fulltext.Value) => {
		setSearchFn(value);
		onSearchChangeFn?.(value);
	};

	return (
		<Container
			data-ui="LocationSelect"
			data-ui-layout="vertical-header-content"
			data-ui-height="full"
			data-ui-gap="default"
			{...props}
		>
			<Fulltext
				data-action={"search location"}
				state={{
					value: search,
					setFn: handleSearchChangeFn,
				}}
				textPlaceholder={translator.textFn("Location search (placeholder)")}
				autoFocus
			/>

			<Suspense fallback={<ListContainer.Fallback />}>
				<ListContainer
					textHint={textHint}
					search={search}
					value={value}
					onChangeFn={onChangeFn}
					allowClear={allowClear}
					onLocationFn={onLocationFn}
					warningStatusProps={warningStatusProps}
				/>
			</Suspense>
		</Container>
	);
};
