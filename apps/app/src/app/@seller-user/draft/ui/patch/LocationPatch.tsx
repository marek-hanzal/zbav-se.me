import { translator } from "@use-pico/common/translator";
import type { tDraft } from "@zbav-se.me/sdk/api/seller-user";
import { TitleContainer } from "@zbav-se.me/ui/container";
import type { FC } from "react";
import { LocationSelectContainer } from "~/app/@common/location/ui/LocationSelectContainer";
import { useDraftPatch } from "~/app/@seller-user/draft/hook/useDraftPatch";

export namespace LocationPatch {
	export interface Props extends TitleContainer.Props {
		draft: tDraft;
		onCancel(): void;
		onSettled?(): void;
	}
}

export const LocationPatch: FC<LocationPatch.Props> = ({
	draft,
	onCancel,
	onSettled,
	...props
}) => {
	const { patch, isPending } = useDraftPatch({
		draft,
		onSettled,
	});

	return (
		<TitleContainer
			data-ui={"Setup-[TitleContainer.location]"}
			textTitle={translator.text("Location (title)")}
			{...props}
		>
			<LocationSelectContainer
				textHint={translator.text("Location security (hint)")}
				onCancel={onCancel}
				onSave={({ locationId }) =>
					patch({
						locationId,
					})
				}
				loading={isPending}
				value={draft.locationId}
				ui={{
					inner: "default",
				}}
			/>
		</TitleContainer>
	);
};
