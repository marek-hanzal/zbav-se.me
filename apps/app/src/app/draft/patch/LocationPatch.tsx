import type { tDraft } from "@zbav-se.me/sdk/api/user";
import { TitleContainer } from "@zbav-se.me/ui/container";
import type { FC } from "react";
import { LocationControl } from "~/app/location/ui/LocationControl";

export namespace LocationPatch {
	export interface Props extends TitleContainer.Props {
		locale: string;
		draft: tDraft;
		value: string | undefined | null;
		onCancel(): void;
		onSave(locationId: string | null): void;
		loading: boolean;
	}
}

export const LocationPatch: FC<LocationPatch.Props> = ({
	locale,
	draft,
	value,
	onCancel,
	onSave,
	loading,
	...props
}) => {
	return (
		<TitleContainer
			data-ui={"Setup-[TitleContainer.location]"}
			textTitle={"Location (title)"}
			{...props}
		>
			<LocationControl
				locale={locale}
				onCancel={onCancel}
				onSave={({ locationId }) => {
					onSave(locationId);
				}}
				loading={loading}
				value={value}
				ui={{
					inner: "default",
				}}
			/>
		</TitleContainer>
	);
};
